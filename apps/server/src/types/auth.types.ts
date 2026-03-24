export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export interface IAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
