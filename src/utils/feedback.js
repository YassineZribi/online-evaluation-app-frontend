import toast from 'react-simple-toasts';
 
export const alertError = (message) => {
    toast(message, { className: 'toast-error' })
}

export const alertSuccess = (message) => {
    toast(message, { className: 'toast-success' })
}

export const alertInfo = (message) => {
    toast(message, { className: 'toast-info' })
}

export const alertWarning = (message) => {
    toast(message, { className: 'toast-warning' })
}