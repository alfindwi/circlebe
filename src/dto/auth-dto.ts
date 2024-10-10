export type RegisterDTO = {
  fullName: string;
  email: string;
  passwordUsers: string;
  username: string;
  imgage?: string;
};

export type LoginDTO = {
  email: string;
  username: string;
  passwordUsers: string;
};

export interface ResetPasswordDTO {
  token: string;
  passwordUsers: string;
}
