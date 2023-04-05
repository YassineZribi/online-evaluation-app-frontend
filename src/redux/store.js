import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers/rootReducer'

console.log(import.meta.env)

const enhancer = import.meta.env.MODE == 'development'
               ? composeWithDevTools(applyMiddleware(thunk))
               : applyMiddleware(thunk)

const store = createStore(rootReducer, enhancer)

export default store