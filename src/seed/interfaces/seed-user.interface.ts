export interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  roles: ValidRoles[];
}

type ValidRoles = 'admin' | 'super-user' | 'user';
