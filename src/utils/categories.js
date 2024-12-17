export const categoryColors = {
  'Food': {
    bg: 'bg-success',
    color: '#28a745'
  },
  'Transport': {
    bg: 'bg-info',
    color: '#17a2b8'
  },
  'Utilities': {
    bg: 'bg-warning',
    color: '#ffc107'
  },
  'Entertainment': {
    bg: 'bg-primary',
    color: '#007bff'
  },
  'Miscellaneous': {
    bg: 'bg-secondary',
    color: '#6c757d'
  }
};

export const getCategoryBadgeClass = (category) => {
  return categoryColors[category]?.bg || 'bg-secondary';
};

export const getCategoryColor = (category) => {
  return categoryColors[category]?.color || '#6c757d';
};