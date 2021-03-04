import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import userReducer, { restoreSessionAction } from "./userDuck";
import charsReducers, { getCharactersAction } from "./charsDuck";
import thunk from "redux-thunk";

let rootReducer = combineReducers({
  user: userReducer,
  characters: charsReducers,
});

/* Redux Dev Tool */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  let store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  //we bring the characters for the first time
  getCharactersAction()(store.dispatch, store.getState);

  restoreSessionAction()(store.dispatch);

  return store;
}
