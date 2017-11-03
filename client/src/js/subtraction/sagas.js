/**
 *
 *
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 *
 */

import { call, put, takeLatest, throttle } from "redux-saga/effects";

import subtractionAPI from "./api";
import { setPending } from "../wrappers";
import { FIND_SUBTRACTIONS, LIST_SUBTRACTION_IDS, GET_SUBTRACTION, CREATE_SUBTRACTION }  from "../actionTypes";

export function* watchSubtraction () {
    yield throttle(500, FIND_SUBTRACTIONS.REQUESTED, findSubtractions);
    yield takeLatest(LIST_SUBTRACTION_IDS.REQUESTED, listSubtractionIds);
    yield takeLatest(GET_SUBTRACTION.REQUESTED, getSubtraction);
    yield takeLatest(CREATE_SUBTRACTION.REQUESTED, createSubtraction);
}

export function* findSubtractions (action) {
    yield setPending(function* (action) {
        try {
            const response = yield call(subtractionAPI.find, action.term, action.page);
            yield put({type: FIND_SUBTRACTIONS.SUCCEEDED, data: response.body});
        } catch (error) {
            yield put({type: FIND_SUBTRACTIONS.FAILED, error});
        }
    }, action);
}

export function* listSubtractionIds () {
    const response = yield subtractionAPI.listIds();
    yield put({type: LIST_SUBTRACTION_IDS.SUCCEEDED, data: response.body});
}

export function* getSubtraction (action) {
    try {
        const response = yield call(subtractionAPI.get, action.subtractionId);
        yield put({type: GET_SUBTRACTION.SUCCEEDED, data: response.body});
    } catch (error) {
        yield put({type: GET_SUBTRACTION.FAILED, error});
    }
}

export function* createSubtraction (action) {
    try {
        const response = yield call(subtractionAPI.create, action.subtractionId, action.fileId);
        yield put({type: CREATE_SUBTRACTION.SUCCEEDED, data: response.body});
    } catch (error) {
        yield put({type: CREATE_SUBTRACTION.FAILED, error});
    }
}