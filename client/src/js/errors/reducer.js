import { endsWith, replace } from "lodash-es";
import { reportAPIError } from "../utils";
import {
    CLEAR_ERROR,
    CREATE_SAMPLE,
    UPDATE_SAMPLE,
    CREATE_VIRUS,
    EDIT_VIRUS,
    ADD_ISOLATE,
    EDIT_ISOLATE,
    ADD_SEQUENCE,
    EDIT_SEQUENCE,
    CREATE_INDEX,
    CREATE_SUBTRACTION,
    UPDATE_ACCOUNT,
    CHANGE_ACCOUNT_PASSWORD,
    CREATE_USER,
    EDIT_USER,
    CREATE_GROUP
} from "../actionTypes";

const checkActionFailed = (action) => {
    const isFailed = endsWith(action.type, "_FAILED");
    return isFailed ? action : false;
};

const getErrorName = (action) => (
    replace(action.type, "_FAILED", "_ERROR")
);

const resetErrorName = (action) => {
    if (endsWith(action.type, "_REQUESTED")) {
        return replace(action.type, "_REQUESTED", "_ERROR");
    }
};

export default function errorsReducer (state = null, action) {

    if (action.type === CLEAR_ERROR) {
        // Clear specific error explicitly
        return {...state, [action.error]: null};
    }

    const failedAction = checkActionFailed(action);

    if (failedAction) {
        const errorName = getErrorName(action);

        const errorPayload = { status: failedAction.status, message: failedAction.message };

        switch (failedAction.type) {

            case CREATE_SAMPLE.FAILED:
            case UPDATE_SAMPLE.FAILED:
            case CREATE_VIRUS.FAILED:
            case EDIT_VIRUS.FAILED:
            case ADD_ISOLATE.FAILED:
            case EDIT_ISOLATE.FAILED:
            case ADD_SEQUENCE.FAILED:
            case EDIT_SEQUENCE.FAILED:
            case CREATE_INDEX.FAILED:
            case CREATE_SUBTRACTION.FAILED:
            case UPDATE_ACCOUNT.FAILED:
            case CHANGE_ACCOUNT_PASSWORD.FAILED:
            case CREATE_USER.FAILED:
            case EDIT_USER.FAILED:
            case CREATE_GROUP.FAILED:
                return {...state, [errorName]: errorPayload};

            default:
                // Report uncaught errors to Sentry
                reportAPIError(failedAction);
                return state;
        }
    }

    // Ignore requests until an error has occurred
    const errorName = state ? resetErrorName(action) : null;

    // Only clear errors on request that had been set previously
    if (errorName && state[errorName]) {
        return {...state, [errorName]: null};
    }
    return state;
}
