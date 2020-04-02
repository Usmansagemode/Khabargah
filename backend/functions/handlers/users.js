const { admin,db } = require('../util/admin');
const { validateSignupData, validateLoginData, reduceUserDetails} = require('../util/validators');

var firebaseConfig = {
    apiKey: "AIzaSyBInS_bhHmxV7Qezv8rCHD86p-tObZSZvU",
    authDomain: "sage-mode.firebaseapp.com",
    databaseURL: "https://sage-mode.firebaseio.com",
    projectId: "sage-mode",
    storageBucket: "sage-mode.appspot.com",
    messagingSenderId: "648192850537",
    appId: "1:648192850537:web:56427ed9cf15d360f340f8",
    measurementId: "G-10SPW64BKX"
  };

const config = require('../util/config')
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
// firebase.initializeApp(config);

// Sign up user.
exports.signup = (req,res) => {
    //extract form data from req body
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const {valid, errors} = validateSignupData(newUser); //extract valid and errors
    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png'

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => { //accept promise
            if(doc.exists){ //then doc (user/handle) already exists therefore return 400 (bad input)
                return res.status(400).json({ handle: 'this handle is already taken'});
            } else {
                return firebase
                            .auth()
                            .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => { //accept for creatuserWithEmailAndPassword promise
            //return authentication token.
            //data has access to Id.
            userId = data.user.uid;
            return data.user.getIdToken();

        })
        .then(idToken => { //token used to access any router that is protected.
            token = idToken;
            const userCredtentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/sage-mode.appspot.com/o/${noImg}?alt=media`,
                userId
            };
            //now persist this object into a new document of users collection.
            return db.doc(`/users/${newUser.handle}`).set(userCredtentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === "auth/email-already-in-use"){
                return res.status(400).json({ email: 'Email is already in use'});
            } else {
                return res.status(500).json({ general: 'Something went wrong, please try agian.' });
            }
            
        });
};

// Login user
exports.login = (req,res) => {
    //validate data for login, login takes email and password.
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    const {valid, errors} = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);
    
    
    firebase
        .auth()
        .signInWithEmailAndPassword(user.email,user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
        .catch((err) => {
            console.error(err);
            //auth/wrong-password
            // auth/user-not-user 
            return res
                .status(403)
                .json({ general: 'Wrong credentials, please try again'});
            
        }); 
}

// add user details
exports.addUserDetails = (req,res) => {
    let userDetails = reduceUserDetails(req.body);
    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({message: 'Details added successfully'});
        })
        .catch( err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

//Get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
    .then(doc => {
        if(doc.exists){
            userData.user = doc.data();
            return db
            .collection('khabar')
            .where('userHandle','==',req.params.handle)
            .orderBy('createdAt', 'desc')
            .get();
        } else {
            return res.status(404).json( {error: 'User not found'} )
        }
    })
    .then(data => {
        userData.khabars = [];
        data.forEach(doc => {
            userData.khabars.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                userHandle: doc.data().userHandle,
                userImage: doc.data().userImage,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                khabarId: doc.id
            })
        });
        return res.json(userData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}
//getown user details
exports.getAuthenticatedUser = (req,res) => {
    //
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            console.log(doc)
            console.log(doc.data())
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });
            // return res.json(userData);
            return db.collection('notifications').where('recipient','==',req.user.handle) //return notifications 03:39:25
            .orderBy('createdAt', 'desc').limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    khabarId: doc.data().khabarId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                });
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });
};

// Upload a profile for user
exports.uploadImage = (req, res) => {
    //use package
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFilename;
    let imageToBeUploaded = {}; //we need to create this image

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: "Wrong file type submitted"});
        }
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);

        //my.image.png (we need to get png)
        const imageExtension = filename.split('.')[filename.split('.').length-1]; //array of strings borken at .'s index at last element of that array
        //actual image filename used
        imageFilename = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);
        //creating imageToBeUploaded here
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath)); //this creates the file 
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/sage-mode.appspot.com/o/${imageFilename}?alt=media`; //now we need to add this imageUrl to our user doct. alt media allows to show image than download it to computer.
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        });
    });
    busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
    //something new: called batch write. in firebase when you need update multiple dcument
    let batch = db.batch();
    req.body.forEach( notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true});
    });
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked as read' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};