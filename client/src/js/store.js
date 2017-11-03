/**
 *
 *
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 *
 */

import { assign } from "lodash";
import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerReducer, routerMiddleware } from "react-router-redux";

import { SET_APP_PENDING, UNSET_APP_PENDING } from "./actionTypes";
import jobsReducer from "./jobs/reducers";
import samplesReducer from "./samples/reducers";
import indexesReducer from "./indexes/reducers";
import virusesReducer from "./viruses/reducers";
import subtractionReducer from "./subtraction/reducers";
import filesReducer from "./files/reducer";
import accountReducer from "./account/reducers";
import settingsReducer from "./settings/reducers";
import usersReducer from "./users/reducers";
import groupsReducer from "./groups/reducers";
import updatesReducer from "./updates/reducers";
import rootSaga from "./sagas";



export const initializeStore = (history) => {
    const sagaMiddleware = createSagaMiddleware();

    const appInitialState = {
        pending: false
    };

    const appReducer = (state = appInitialState, action) => {

        switch (action.type) {

            case SET_APP_PENDING:
                return assign({}, state, {pending: true});

            case UNSET_APP_PENDING:
                return assign({}, state, {pending: false});
        }

        return state;
    };

    return createStore(
        combineReducers({
            app: appReducer,
            jobs: jobsReducer,
            samples: samplesReducer,
            viruses: virusesReducer,
            indexes: indexesReducer,
            subtraction: subtractionReducer,
            files: filesReducer,
            settings: settingsReducer,
            users: usersReducer,
            groups: groupsReducer,
            account: accountReducer,
            updates: updatesReducer,
            router: routerReducer
        }),
        applyMiddleware(sagaMiddleware, routerMiddleware(history)),
    );
};