import Swal from 'sweetalert2';

/**
 * Display a success alert popup with highlighted OK button
 * @param {string} title - The title of the alert (e.g., "Product Added Successfully")
 * @param {string} message - The message/description text
 * @returns {Promise} - Resolves when the alert is dismissed
 */
export const showSuccessAlert = (title, message) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#10b981',
    confirmButtonAriaLabel: 'OK',
    buttonsStyling: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    didOpen: (modal) => {
      const confirmButton = modal.querySelector('.swal2-confirm');
      if (confirmButton) {
        confirmButton.focus();
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.padding = '10px 25px';
      }
    },
  });
};

/**
 * Display an error alert popup with highlighted OK button
 * @param {string} title - The title of the alert (e.g., "Failed to Add Product")
 * @param {string} errorMessage - The error message/description text
 * @returns {Promise} - Resolves when the alert is dismissed
 */
export const showErrorAlert = (title, errorMessage) => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: errorMessage || 'An error occurred. Please try again.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ef4444',
    confirmButtonAriaLabel: 'OK',
    buttonsStyling: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
    didOpen: (modal) => {
      const confirmButton = modal.querySelector('.swal2-confirm');
      if (confirmButton) {
        confirmButton.focus();
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.padding = '10px 25px';
      }
    },
  });
};

/**
 * Display a warning alert popup with highlighted OK button
 * @param {string} title - The title of the alert
 * @param {string} message - The warning message
 * @returns {Promise} - Resolves when the alert is dismissed
 */
export const showWarningAlert = (title, message) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message || 'Please be careful.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#f59e0b',
    confirmButtonAriaLabel: 'OK',
    buttonsStyling: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
    didOpen: (modal) => {
      const confirmButton = modal.querySelector('.swal2-confirm');
      if (confirmButton) {
        confirmButton.focus();
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.padding = '10px 25px';
      }
    },
  });
};

/**
 * Display an info alert popup with highlighted OK button
 * @param {string} title - The title of the alert
 * @param {string} message - The info message
 * @returns {Promise} - Resolves when the alert is dismissed
 */
export const showInfoAlert = (title, message) => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message || 'Please note this information.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3b82f6',
    confirmButtonAriaLabel: 'OK',
    buttonsStyling: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
    didOpen: (modal) => {
      const confirmButton = modal.querySelector('.swal2-confirm');
      if (confirmButton) {
        confirmButton.focus();
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.padding = '10px 25px';
      }
    },
  });
};

/**
 * Display a confirmation dialog
 * @param {string} title - The title of the confirmation dialog
 * @param {string} message - The confirmation message
 * @param {string} confirmText - Text for the confirm button (default: "Yes")
 * @param {string} cancelText - Text for the cancel button (default: "No")
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export const showConfirmAlert = (title, message, confirmText = 'Yes', cancelText = 'No') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    allowOutsideClick: false,
    allowEscapeKey: true,
    buttonsStyling: true,
    didOpen: (modal) => {
      const confirmButton = modal.querySelector('.swal2-confirm');
      if (confirmButton) {
        confirmButton.focus();
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.padding = '10px 25px';
      }
    },
  }).then((result) => result.isConfirmed);
};

export default {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  showInfoAlert,
  showConfirmAlert,
};
