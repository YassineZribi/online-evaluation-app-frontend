import { alertError } from "../../utils/feedback";
import { REQUEST_STARTED, REQUEST_SUCCEEDED, REQUEST_FAILED, PAGE_LOADING_END, BACKDROP_TOGGLED } from "../types/feedbackTypes";

export const requestStarted = () => ({
    type: REQUEST_STARTED
})

export const requestSucceeded = () => ({
    type: REQUEST_SUCCEEDED
})

export const pageLoadingEnd = () => ({
    type: PAGE_LOADING_END
})

export const displayBackdrop = (show) => ({
    type: BACKDROP_TOGGLED,
    payload: show
})

export const requestFailed = (err) => {
    let errorMessage = err.message || 'Request failed'
    if (err && err.response && err.response.data && err.response.data.error && typeof(err.response.data.error) === 'string') {
        errorMessage = err.response.data.error
    }
    if (err && err.response && err.response.data && err.response.data.error && err.response.data.error.details) {
        errorMessage =  err.response.data.error.details[0] && err.response.data.error.details[0].message
    }
    if (errorMessage) {
        alertError(errorMessage)
    }
    return {
        type: REQUEST_FAILED,
        payload: errorMessage
    }
}