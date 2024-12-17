
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

export const showConfirm = async (title, message, confirmButtonText = 'Yes, delete it!') => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText
  });

  return result.isConfirmed;
};

export const showLoading = (message = 'Please wait...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const closeLoading = () => {
  Swal.close();
};
