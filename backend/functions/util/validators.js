


//helper function to see whether string is empty or not 
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;

};
const isEmail = (email) => {
    // const regEx = /^(([^<>()\[\]\\.,;:\s@"] +(\.[^<>()\[\]\\.,;:\s@"]+)*)| (".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+]a-zA-Z]{2,}))$/;
    const regEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    if (email.match(regEx)) return true;
    else return false;
    // return true;
};

exports.validateSignupData = (data) => {
    let errors = {};
    
    //for email
    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address';
    }

    //for password
    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) 
        errors.confirmPassword = 'Passwords must match';

    //for handle/username
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty';

    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};
    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())) {
        //https://wedsite.con we will had http if user inputs website.com or uses http's'
        if(data.website.trim().substring(0,4) !== 'http') {
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};