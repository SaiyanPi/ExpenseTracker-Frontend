export interface LoginResponseModel {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresAt: string;
  errors: string[];
}

