export const formatBudget = (budget: number): string => {
  return new Intl.NumberFormat("eu-US", {
    style: "currency",
    currency: "eur",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget);
};
