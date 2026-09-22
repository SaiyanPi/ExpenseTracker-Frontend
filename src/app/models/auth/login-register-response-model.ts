export interface LoginRegisterResponseModel {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresAt: string;
  errors: string[];
}

