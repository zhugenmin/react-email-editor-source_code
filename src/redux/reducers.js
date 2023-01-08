/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducerCollection";
import thunk from "redux-thunk";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  let composeEnhancers = compose;
  const rootReducer = combineReducers({
    // router: connectRouter(history),
    ...reducers,
    ...injectedReducers,
  });
  const middlewares = [thunk];

  const enhancers = [applyMiddleware(...middlewares)];
  return createStore(rootReducer, composeEnhancers(...enhancers));
}
