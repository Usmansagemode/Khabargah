import { SET_KHABARS, LIKE_KHABAR, UNLIKE_KHABAR, LOADING_DATA, DELETE_KHABAR, POST_KHABAR, SET_KHABAR, SUBMIT_COMMENT } from '../types';

const initialState = {
    khabars: [],
    khabar: {},
    loading: false
};

export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_KHABARS:
            return {
                ...state,
                khabars: action.payload,
                loading: false
            };
        case SET_KHABAR:
            return {
                ...state,
                khabar: action.payload
            }
        case LIKE_KHABAR:
        case UNLIKE_KHABAR:
            let index = state.khabars.findIndex((khabar) => khabar.khabarId === action.payload.khabarId);
            state.khabars[index] = action.payload;
            if(state.khabar.khabarId === action.payload.khabarId){
                state.khabar = action.payload;
            }
            return {
                ...state,
            };
        case DELETE_KHABAR:
            let del_index = state.khabars.findIndex(khabar => khabar.khabarId === action.payload);
            state.khabars.splice(del_index, 1);
            return {
                ...state
            };
        case POST_KHABAR:
            //when we get khabar we will add it to our array of khabar
            return {
                ...state,
                khabars: [
                    action.payload,
                    ...state.khabars
                ]
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                khabar: {
                    ...state.khabar, // spread exisiting khabar
                    comments: [action.payload, ...state.khabar.comments] // now we add action.payload to previous comments(spreaded)
                }
            };
        default:
            return state;
        
    }
}