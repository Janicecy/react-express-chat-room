import { createStore, combineReducers, compose } from 'redux';
import room from './room'
import user from './user'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'user',
  storage,
}

const rootReducer = combineReducers({
  room,
  user: persistReducer(persistConfig, user),
});

const store = createStore(
  rootReducer,
  compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

export const persistor = persistStore(store)
export default store 