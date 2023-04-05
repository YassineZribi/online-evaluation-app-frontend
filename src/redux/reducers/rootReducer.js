import { combineReducers } from 'redux'

import feedbackReducer from './feedbackReducer'
import userReducer from './userReducer'

const rootReducer = combineReducers({
    feedback: feedbackReducer,
    user: userReducer
})

export default rootReducer