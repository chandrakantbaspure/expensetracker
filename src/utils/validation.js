
export const validateExpense = (expense) => {
  const errors = {};

  if (!expense.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!expense.amount || expense.amount <= 0) {
    errors.amount = 'Please enter a valid amount';
  }

  if (!expense.category) {
    errors.category = 'Please select a category';
  }

  if (!expense.date) {
    errors.date = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginCredentials = (credentials) => {
  const errors = {};

  if (!credentials.username?.trim()) {
    errors.username = 'Username is required';
  }

  if (!credentials.password?.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistration = (userData) => {
  const errors = {};

  if (!userData.username?.trim()) {
    errors.username = 'Username is required';
  } else if (userData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!userData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!userData.password?.trim()) {
    errors.password = 'Password is required';
  } else if (userData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
