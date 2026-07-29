export interface ApiMessage {
  message: string;
}

export interface ApiUser {
  email: string;
  name: string;
  roles: string[];
}

export interface AuthResponse {
  message: string;
  user: ApiUser;
  tokens?: {
    accessToken: string;
  };
  accessToken?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  termsAcceptedAt: string | null;
  termsVersion: string | null;
}

export interface UsersListResponse {
  message: string;
  users: UserDto[];
}

export interface SingleUserResponse {
  message: string;
  user: UserDto;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters with uppercase, lowercase, number, and special character";

export const UserRoles = {
  MEMBER: "member",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const DEFAULT_ROLE = UserRoles.MEMBER;
