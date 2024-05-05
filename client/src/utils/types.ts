/* eslint-disable @typescript-eslint/no-explicit-any */

export interface User {
  username: string;
  email: string;
  token: string;

  role?: string;
  is_active?: boolean;
}

export interface AuthInitialState {
  user: User | null;
  loginError: any;
  //other
  userPermissionToBeEdited: any;
  hasToVerify: boolean;
}

export interface CategoryInitialState {
  fetchedCategories: CategoryData[];
}

export interface CategoryData {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface Options {
  value: string;
  label: string;
}
//options

export interface Data {
  fileName: string;
  name: string;
  email: string;
  size: string;
  lastModified: string;

  type: string;

  selectAll?: any;
}

// export interface FolderType {
//   folderName: string;
//   noOfFiles: number;
//   fileSize?: string;
//   img: string;
// }

export interface ManageAccessFileType {
  user_id: number;
  file_id: number;
  status: boolean;
  created_at: string;
  reason: string;
  id: number;
}

type Role = "admin" | "manager" | "employee";

export interface OverviewData {
  username: string;
  email: string;
  status: string;
  role: Role;
  is_active: boolean;

  selectAll?: boolean;
}

export interface PermissionsDataType {
  username: string;
  email: string;
  is_active: boolean;
  // status: string;

  id: number;

  role: Role;

  can_read: boolean;
  can_delete: boolean;
  can_write: boolean;
}

export interface RecentActivityData {
  image: string;
  activityText: string;
  timeAgo: string;
}
export interface LogDetail {
  username: string;
  created_at: any;
  action_taken: string;
}
export interface CategoryAccessData {
  category_id: number;
  user_id: number;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

// export interface FileData {
//   file_name: string;
//   file_size: string;
//   folder_id: number | null;
//   category_id: number | null;
//   description: string;
//   file: File | any;
// }
export interface FileData {
  id: number;
  user_id: number;
  folder_id: number;
  category_id: number;
  file_name: string;
  file_size: string;
  description: string;
  category_name: string;
  cloud_url: string;
  folder_name: string;
  owner_username: string;
  created_at: string;
  updated_at: string;
  file?: File | null;
  file_id?: number;

  access_type?: string;
  can_access: boolean;
}

export interface FileInitialState {
  files: FileData[] | null;
}

export interface FolderType {
  id: number;
  name: string;
  files: any;
  fileSize: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface FolderInitialState {
  fetchedFolders: FolderType[] | null;
}

export interface FolderDetails {
  folder_id: number;
  user_id: number;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface FileDetails {
  file_id: number;
  user_id: number;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}
export interface PermissionDetails {
  user_id: number;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  is_active: boolean;
  role: string;
}
