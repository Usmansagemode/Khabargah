const { admin, db } = require('./admin');
// FB AUTH is for middleware authentication.
module.exports = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]; //give us back an arrar of 2 strings. Bearer and Token
    } else {
        console.error('No Token Found');
        return res.status(403).json( {error: 'Unauthorized'} ); //403 not authorized
    }
    //now not enough to just check for token but also that it was issued by OUR application.
    admin
        .auth()
        .verifyIdToken(idToken)
        .then(decodedToken => { //decodedToken holds data inside of our idToken (user data) we need to add this data to req to be used during posting
            req.user = decodedToken; //we also need the handle because by default the handle is not stored in authentication system. handle is in our database
            // console.log(decodedToken);
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1) //limits our doc to just one result.
                .get();
        })
        .then(data => { //getting handle
            req.user.handle = data.docs[0].data().handle; //promise returns list even though limit(1) therefore extract using [0]
            req.user.imageUrl = data.docs[0].data().imageUrl; //set up image uploading here done in 2:50:00
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        });
};
//************** */