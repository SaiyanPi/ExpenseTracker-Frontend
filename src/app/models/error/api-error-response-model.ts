export interface ApiErrorResponseModel {
  statusCode: number;
  error: string;
  message: string;
  details: Record<string, string[]> | null;
  traceId: string;
  correlationId: string;
}
