
export const applyFilters = (expenses, filters) => {
  return expenses.filter(expense => {
    const matchesCategory = !filters.category ||
                          expense.category === filters.category;

    const matchesKeyword = !filters.keyword ||
                          expense.title.toLowerCase().includes(filters.keyword.toLowerCase());

    const expenseDate = new Date(expense.date);
    const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
    const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

    const matchesDateRange = (!startDate || expenseDate >= startDate) && 
                           (!endDate || expenseDate <= endDate);

    return matchesCategory && matchesKeyword && matchesDateRange;
  });
};

export const resetFilters = () => ({
  category: '',
  dateRange: {
    start: '',
    end: ''
  },
  keyword: ''
});
