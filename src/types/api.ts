export interface ApiMessage {
  message: string;
}

export interface ApiUser {
  id: string;
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

export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  projectImage: string | null;
  projectStatus: "open" | "closed";
  isActive: boolean;
  members: UserDto[];
  creator: UserDto;
  createdIn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsListResponse {
  message: string;
  projects: ProjectDto[];
}

export interface SingleProjectResponse {
  message: string;
  project: ProjectDto;
}

export interface DeleteProjectResponse {
  message: string;
}

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const tasksStatus = {
  TODO: "todo",
  INPROGRESS: "inprogress",
  DONE: "done",
} as const;

export type TasksStatus = (typeof tasksStatus)[keyof typeof tasksStatus];

export const tasksPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TasksPriority = (typeof tasksPriority)[keyof typeof tasksPriority];

export interface TaskImageDto {
  id: string;
  key: string;
  url: string;
  order: number;
  createdAt: string;
}

export interface TaskUserDto {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  status: TasksStatus;
  priority: TasksPriority;
  dueDate: string | null;
  completedAt: string | null;
  project: { id: string };
  creator: TaskUserDto;
  assignee: TaskUserDto | null;
  images: TaskImageDto[];
  createdAt: string;
  updatedAt: string;
}

export interface TasksListResponse {
  message: string;
  tasks: TaskDto[];
}

export interface SingleTaskResponse {
  message: string;
  task: TaskDto;
}

export interface NoteDto {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotesListResponse {
  message: string;
  data: NoteDto[];
}

export interface SingleNoteResponse {
  message: string;
  data: NoteDto;
}
