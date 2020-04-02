let db = {
    users: [
        {
            createdAt: "2020-03-17T03:50:20.602Z",
            email: "naruto@email.com",
            handle: "naruto",
            userId: "rqzCnVRGRlSpHfKOptcxBiIksfq1",
            imageUrl: 'image/fwnfo/fwvw',
            bio: 'Hello, my name i naruto, i will become the hokage.',
            website: 'wwwbelieveit.com',
            location: 'Leaf Village'
        }
    ],
    khabars: [
        {
            userHandle: 'naruto',
            body: 'this is the khabar body',
            createdAt: '2020-03-16T09:04:21.609Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'luffy',
            khabarId: 'fuhrfuhrfiohewihf',
            body: 'good luck!',
            createdAt: '2020-03-16T09:04:21.609Z'
        }
    ],
    notifications: [
        {
            recipient: 'luffy',
            sender: 'nauto',
            read: 'true | false',
            khabarId: 'fnvernfenfnev',
            type: 'like | comment',
            createdAt: '2020-03-20T09:04:21.609Z'
        }
    ]
};

const userDetails = {
    //redux data
    credentionals: {
        createdAt: "2020-03-17T03:50:20.602Z",
            email: "naruto@email.com",
            handle: "naruto",
            userId: "rqzCnVRGRlSpHfKOptcxBiIksfq1",
            imageUrl: 'image/fwnfo/fwvw',
            bio: 'Hello, my name i naruto, i will become the hokage.',
            website: 'www.believeit.com',
            location: 'Leaf Village'
    },
    likes: [
        {
            userHandle: 'naruto',
            khabarId: 'fuhrfuhrfiohewihf'
        },
        {
            userHandle: 'naruto',
            khabarId: 'fuhrjhcvhjdbkjashf'
        }
    ]
};