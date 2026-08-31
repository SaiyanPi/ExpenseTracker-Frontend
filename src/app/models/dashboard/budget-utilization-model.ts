export interface BudgetUtilizationModel {
  budgetName: string,
  budgetTarget: number,
  actualSpent: number | null,
  utilizationPercentage: number
}
