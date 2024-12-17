import Swal from 'sweetalert2';

export const showSuccess = (title, message = '', timer = 2000) => {
    return Swal.fire({
        icon: 'success',
        title,
        text: message,
        timer,
        showConfirmButton: false
    });
};

export const showError = (title, message = '') => {
    return Swal.fire({
        icon: 'error',
        title,
        text: message
    });
};



