import axios from 'axios';

import { alertSuccess } from '../../utils/feedback';
import { LOGIN, LOGOUT } from '../types/userTypes';
import { requestFailed, requestStarted, requestSucceeded, pageLoadingEnd } from './feedbackActionCreators';
import setAuthToken from '../../utils/setAuthToken';
import api from '../../utils/api';

export const login = (user, token) => ({ type: LOGIN, payload: { user, token } });

export const logout = () => {
    setAuthToken()
    return { type: LOGOUT }
};


export const requestLogin = (email, password) => {
    return async (dispatch) => {
        dispatch(requestStarted())
        try {
            const res = await api.post(`/auth/login`, { email, password })
            dispatch(requestSucceeded())
            const { message, token, user } = res.data
            alertSuccess(message)
            setAuthToken(token)
            dispatch(login(user, token))
        } catch (err) {
            dispatch(requestFailed(err))
        }
    }
}


export const requestRegister = ({ firstName, lastName, email, password }, history) => {
    return async (dispatch, getState) => {
        dispatch(requestStarted())
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { firstName, lastName, email, password })
            console.log({res});
            dispatch(requestSucceeded())
            if (res.data.message) {
                alertSuccess(res.data.message)
            }
            history.push('/login')
        } catch (err) {            
            dispatch(requestFailed(err))            
        }
    }
}

export const requestLoadUser = (token) => {
    return async (dispatch) => {
        try {
            const res = await api.get(`/auth`, {headers: { authorization: token }})
            const { user } = res.data
            setAuthToken(token)
            dispatch(login(user, token))
        } catch (err) {
            setAuthToken()
            dispatch(requestFailed(err))
        }
        finally {
            dispatch(pageLoadingEnd())
        }
    }
}