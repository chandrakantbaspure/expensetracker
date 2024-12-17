
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return new Date(date).toLocaleDateString(undefined, {
    ...defaultOptions,
    ...options
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatNumber = (number, options = {}) => {
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  return new Intl.NumberFormat(undefined, {
    ...defaultOptions,
    ...options
  }).format(number);
};

export const formatPercentage = (number) => {
  return new Intl.NumberFormat(undefined, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(number / 100);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
