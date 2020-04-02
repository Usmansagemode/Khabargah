import { SET_KHABARS,  LOADING_DATA, LIKE_KHABAR, UNLIKE_KHABAR, DELETE_KHABAR, POST_KHABAR, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_KHABAR, STOP_LOADING_UI, SUBMIT_COMMENT } from '../types';
import axios from 'axios';


// GET ALL KHABAR
export const getKhabars = () => (dispatch) => {
    dispatch({ type: LOADING_DATA});
    axios.get('/khabars')
        .then(res => {
            dispatch({
                type: SET_KHABARS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_KHABARS,
                payload: []
            })
        })
};

//
export const getKhabar = (khabarId) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/khabar/${khabarId}`)
        .then(res => {
            dispatch({
                type: SET_KHABAR,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch(err => console.log(err));
};
// POst a khabar
export const postKhabar = (newKhabar) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/khabar', newKhabar)
        .then(res => {
            dispatch({
                type: POST_KHABAR,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        })
};

// Like a khabar
export const likeKhabar = (khabarId) => dispatch => {
    axios.get(`/khabar/${khabarId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_KHABAR,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
};

// Unike a khabar
export const unlikeKhabar = (khabarId) => dispatch => {
    axios.get(`/khabar/${khabarId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_KHABAR,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
};

// Submit a comment
export const submitComment = (khabarId, commentData) => (dispatch) => {
    axios.post(`/khabar/${khabarId}/comment`, commentData)
    .then(res => {
        dispatch({
            type: SUBMIT_COMMENT,
            payload: res.data
        });
        dispatch(clearErrors());
    })
    .catch(err => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        });
    });
};

export const deleteKhabar = (khabarId) => (dispatch) => {
    axios.delete(`/khabar/${khabarId}`)
    .then(() => {
        dispatch({ type: DELETE_KHABAR, payload: khabarId })
    })
    .catch(err => console.log(err));

};

export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
    .then(res => {
        dispatch({
            type: SET_KHABARS,
            payload: res.data.khabars
        });
    })
    .catch(() => {
        dispatch({
            type: SET_KHABARS,
            payload: null
        })
    });
}

// action creater
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}