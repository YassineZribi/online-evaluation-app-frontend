import { REQUEST_FAILED, REQUEST_STARTED, REQUEST_SUCCEEDED, PAGE_LOADING_END, BACKDROP_TOGGLED } from "../types/feedbackTypes";

const initialState = {
    pageLoading: true,
    loading: false,
    backdrop: false,
    error: ""
};

const feedbackReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_STARTED: {
            return {
                ...state,
                loading: true
            }
        }
        case REQUEST_SUCCEEDED: {
            return {
                ...state,
                loading: false
            }
        }
        case REQUEST_FAILED: {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        }
        case PAGE_LOADING_END: {
            return {
                ...state,
                pageLoading: false
            }
        }
        case BACKDROP_TOGGLED: {
            return {
                ...state,
                backdrop: action.payload
            }
        }
        default: {
            return state;
        }
    }
}

export default feedbackReducer;