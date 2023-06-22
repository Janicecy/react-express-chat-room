import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import room from './room'
import user from './user'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import loggerMiddleware from "redux-logger";

const rootReducer = combineReducers({
  room,
  user: persistReducer({ key: 'user', storage, }, user),
});

const store = createStore(
  rootReducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store)
export default store 