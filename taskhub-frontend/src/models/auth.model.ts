import { Role } from "@/app/enums/role.enum";

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  login: string;
  password: string;
  user: {
    cpf: string;
    email: string;
    name: string;
  };
}

export interface LoginResponse {
  access_token: string;
}

export interface JwtPayload {
  sub: number;
  username: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}