import { Role } from "@/app/enums/role.enum";

export interface User {
  id?: number;
  cpf?: string;
  email?: string;
  name?: string;
  roles?: Role[];
  possuiConta?: boolean;
}

export interface Account {
  login: string;
  password: string;
  user?: User;
}