export interface ValidationResultModel {
  validationErrors: Record<string, string[]>;
  message?: string;
}
