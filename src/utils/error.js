export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || 'An error occurred';
    const status = error.response.status;
    const code = error.response.data?.code;
    return new ApiError(message, status, code);
  } else if (error.request) {
    // Request made but no response
    return new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
  } else {
    // Request setup error
    return new ApiError('Request failed. Please try again.', 0, 'REQUEST_ERROR');
  }
};