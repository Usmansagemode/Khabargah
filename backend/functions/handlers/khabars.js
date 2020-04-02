const { db } = require('../util/admin');


//get khabars
exports.getAllKhabars = (req,res) => {
    db
        .collection('khabar')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let khabars = [];
            data.forEach((doc)=> {
                khabars.push({
                    khabarId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount
                });
            });
            return res.json(khabars);
        })
        .catch((err)=> {
        console.error(err);
        res.status(500).json({error:err.code});
    });
}

exports.postOneKhabar = (req, res) => {
    // request body
    // if(req.method !== 'POST'){
    //     return res.status(400).json({error:'Method not allowed'})
    // }
    
    //ONLY enters this block when FBAuth has run successfully, therefore authenticated.
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'body must not be empty'});
    }

    const newKhabar = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };
    db
        .collection('khabar')
        .add(newKhabar)
        .then(doc => {
            const resKhabar = newKhabar; //2:59:05 like and unlike
            resKhabar.khabarId = doc.id;
            res.json(resKhabar);
            // res.json({message: `document ${doc.id} created successfully`});
        })
        .catch((err)=>{
            res.status(500).json({ error: 'something went wrong'});
            console.error(err);
        });
};

exports.getKhabar = (req, res) => {
    let khabarData = {};
    db.doc(`/khabar/${req.params.khabarId}`).get()
        .then((doc) => {
            console.log(doc)
            if(!doc.exists) {
                return res.status(404).json({ error: 'Khabar not found'});
            }
            khabarData = doc.data();
            // now we need to add khabarId to data
            khabarData.khabarId = doc.id;
            return db.collection('comments')
                    .orderBy('createdAt', 'desc')
                    .where('khabarId', '==', req.params.khabarId).get();
        })
        .then((data) => {
            khabarData.comments = [];
            data.forEach((doc) => {
                khabarData.comments.push(doc.data());
            });
            return res.json(khabarData);
        })
        .catch(err =>{
            console.error(err);
            res.status(500).json({error: err.code});
        });
};


exports.commentOnKhabar = (req,res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ comment: ' must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        khabarId: req.params.khabarId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    //does khabar exist?

    db.doc(`/khabar/${req.params.khabarId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Khabar not found'});
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 }); //03:19:06 adding count number of comment during adding a comment
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.log(err);
            res.statis(500).json({ error: 'something went wrong' });
        });
};

//like a khabar
exports.likeKhabar = (req, res) => {
    //also check if khabar exists
    //check whether a like document exists or not, if yes, cannot like again

    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('khabarId', '==', req.params.khabarId).limit(1);
    const khabarDocument = db.doc(`/khabar/${req.params.khabarId}`);

    let khabarData = {};

    khabarDocument.get()
    .then( doc => {
        if(doc.exists){
            khabarData = doc.data();
            khabarData.khabarId = doc.id;
            return likeDocument.get();
        } else {
            return res.status(404).json({ error: 'khabar not found'});
        }
    })
    .then(data => {
        if(data.empty){
            return db.collection('likes').add({ 
                khabarId: req.params.khabarId,
                userHandle: req.user.handle
            })
            .then(() => {
                khabarData.likeCount++;
                return khabarDocument.update({ likeCount: khabarData.likeCount});
            })
            .then(() => {
                return res.json(khabarData);
            })
        } else { //we have a like in this data, which means it is already likes by the user
            return res.status(400).json({ error: 'Khabar already like' });
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ error: err.code});
    });
};

exports.unlikeKhabar = (req, res) => {
    //also check if khabar exists
    //check whether a like document exists or not, if yes, cannot like again

    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('khabarId', '==', req.params.khabarId).limit(1);
    const khabarDocument = db.doc(`/khabar/${req.params.khabarId}`);

    let khabarData = {};

    khabarDocument.get()
    .then( doc => {
        if(doc.exists){
            khabarData = doc.data();
            khabarData.khabarId = doc.id;
            return likeDocument.get();
        } else {
            return res.status(404).json({ error: 'khabar not found'});
        }
    })
    .then(data => {
        if(data.empty){
            return res.status(400).json({ error: 'Khabar NOT liked' });
        } else { //we have a like in this data, which means it is already likes by the user
            return db.doc(`/likes/${data.docs[0].id}`).delete() //path for doc
                .then(() => {
                    khabarData.likeCount--;
                    return khabarDocument.update({ likeCount: khabarData.likeCount});
                })
                .then(() => {
                    return res.json( khabarData );
                })
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ error: err.code});
    });
};

//delete a khabar
exports.deleteKhabar = (req, res) => {
    const document = db.doc(`/khabar/${req.params.khabarId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'khabar not found' });
            }
            console.log(doc)
            console.log(doc.data())
            console.log(doc.data().userHandle);
            console.log(req.user.handle);
            if(doc.data().userHandle !== req.user.handle){
                return res.status(403).json({ error: 'Unauthorized.'}); //403 unauthorized.
            } else {
                return document.delete();
            }
        })
        .then(() => {
            return res.json({ message: 'Khabar deleted successfully'});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};