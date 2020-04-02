const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth'); // FB AUTH is for middleware authentication.

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const { getAllKhabars, postOneKhabar, getKhabar, commentOnKhabar, likeKhabar, unlikeKhabar, deleteKhabar } = require('./handlers/khabars');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead} = require('./handlers/users');

//khabar routes
app.get('/khabars', getAllKhabars);
app.post('/khabar' , FBAuth, postOneKhabar);
app.get('/khabar/:khabarId', getKhabar);
app.delete('/khabar/:khabarId', FBAuth, deleteKhabar);
app.get('/khabar/:khabarId/like', FBAuth, likeKhabar);
app.get('/khabar/:khabarId/unlike', FBAuth, unlikeKhabar);
app.post('/khabar/:khabarId/comment', FBAuth, commentOnKhabar);

//users route
app.post('/signup',signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage); //imageUpload 1:48:46
app.post('/user', FBAuth, addUserDetails); //add and get user profile details 2:13:45
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);//route to get other user details
app.post('/notification', FBAuth , markNotificationsRead);

//https://baseurl.com/khabrs X NOT.
//https://baseurl.com/api/   O YES
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
.onCreate((snapshot) => {
    return db.doc(`/khabar/${snapshot.data().khabarId}`)
    .get()
    .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
            //creae notification
            return db.doc(`/notifications/${snapshot.id}`).set({ //notification id ===  commentId or likeId
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'like',
                read: false,
                khabarId: doc.id
            });
        }
    })
    .catch(err => console.error(err));
});

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(err => {
        console.error(err);
        return;
    })
})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
.onCreate((snapshot) => {
    return db.doc(`/khabar/${snapshot.data().khabarId}`)
    .get()
    .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
            //creae notification
            return db.doc(`/notifications/${snapshot.id}`).set({ //notification id ===  commentId or likeId
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: false,
                khabarId: doc.id
            });
        }
    })
    .catch(err => console.error(err));
})

exports.onUserImageChange = functions.firestore
.document('/users/{userId}')
.onUpdate((change) => {
    //change has 2 properties
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
        console.log('image has changed.'); 
        const batch = db.batch();
        return db.collection('khabar').where('userHandle', '==', change.before.data().handle).get()
        .then((data) => {
            data.forEach(doc => {
                const khabar = db.doc(`/khabar/${doc.id}`);
                batch.update(khabar, {userImage: change.after.data().imageUrl});
            });
            return batch.commit();
        });
    } else return true;
});

exports.onKhabarDelete = functions.firestore
.document('/khabar/{khabarId}')
.onDelete( (snapshot,context) => {
    const khabarId = context.params.khabarId;
    const batch = db.batch();
    return db.collection('comments').where('khabarId','==',khabarId).get()
    .then((data)=> {
        data.forEach(doc => {
            batch.delete(db.doc(`/comments/${doc.id}`) );
        })
    return db.collection('likes').where('khabarId', '==', khabarId).get();
    })
    .then((data)=> {
        data.forEach(doc => {
            batch.delete(db.doc(`/likes/${doc.id}`) );
        })
    return db.collection('notifications').where('khabarId', '==', khabarId).get();
    })
    .then((data)=> {
        data.forEach(doc => {
            batch.delete(db.doc(`/notifications/${doc.id}`) );
        })
    return batch.commit();
    })
    .catch(err => console.error(err));
    
});