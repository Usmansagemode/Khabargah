import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER, MARK_NOTIFICATIONS_READ } from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login ', userData)
        .then(res => {
            // console.log(res.data);
            // const FBIdToken = `Bearer ${res.data.token}`
            // localStorage.setItem('FBIdToken', FBIdToken);
            // axios.defaults.headers.common['Authorization'] = FBIdToken; //each time we send req through axxios it will have authorization header with this value.
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData()); //dispatch request to this function to get user data
            dispatch({ type: CLEAR_ERRORS }); //for any possible errors
            history.push('/'); //push state url and then go to it, redirect to homepage
        })
        .catch(err => {
            //set error of form
            // this.setState({
            //     errors: err.response.data,
            //     loading: false
            // });
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup ', newUserData)
        .then(res => {
            // console.log(res.data);
            // const FBIdToken = `Bearer ${res.data.token}`
            // localStorage.setItem('FBIdToken', FBIdToken);
            // axios.defaults.headers.common['Authorization'] = FBIdToken; //each time we send req through axxios it will have authorization header with this value.
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData()); //dispatch request to this function to get user data
            dispatch({ type: CLEAR_ERRORS }); //for any possible errors
            history.push('/'); //push state url and then go to it, redirect to homepage
        })
        .catch(err => {
            //set error of form
            // this.setState({
            //     errors: err.response.data,
            //     loading: false
            // });
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const logoutUser = () => (dispatch) => {
    //remove token from storage
    localStorage.removeItem('FBIdToken');
    //now we need to remove authorization header form default of axios
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED }); //will clear out our user state in userReducers it will set us back to have having empty state
};

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user')
    .then(res =>{
        dispatch({
            type: SET_USER,
            payload: res.data
        });
    })
    .catch(err => console.log(err));
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user/image', formData)
    .then(() => {
        dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
};

export const markNotificationsRead = (notificationIds) => dispatch => {
    axios.post(`/notification`, notificationIds)
        .then(res => {
            dispatch({
                type: MARK_NOTIFICATIONS_READ
            });
        })
        .catch(err => console.log(err));
};

const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken; //each time we send req through axxios it will have authorization header with this value.
};

