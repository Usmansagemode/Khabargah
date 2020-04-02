import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';
// import const [state, dispatch] = useReducer(reducer, initialState, init)

//initializing initial state
const initialState = {};

//array of middleware
const middleware = [thunk];

//reducers here
const reducers = combineReducers({
    user: userReducer,//actual state, we're naming our objects inside state. anything comes from userReducer will be stored inside the user object,
    data: dataReducer,
    UI: uiReducer
});

const store = createStore(
    reducers, 
    initialState, 
    compose( //3rd usually just the middleware but in our application
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
); 

export default store;