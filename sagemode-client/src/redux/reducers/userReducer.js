import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_KHABAR, UNLIKE_KHABAR, MARK_NOTIFICATIONS_READ } from '../types';

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action) {
    switch(action.type){
        case SET_AUTHENTICATED: // call from App.js
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED: //during logging out, therefore we just return the initial state
            return initialState;
        case SET_USER: //dispatched from userActions.js
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        case LIKE_KHABAR:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        khabarId: action.payload.khabarId
                    }
                ]
            };
        case UNLIKE_KHABAR:
            return {
                ...state,
                likes: state.likes.filter(
                    like => like.khabarId !== action.payload.khabarId
                )
            };
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(notif => notif.read = true);
            return{
                ...state
            };
        default:
            return state;
    }
}