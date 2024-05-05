export interface File {
  id: number;
  user_id: number;
  folder_id: number | null;
  file_name: string;
  file_size: string;
  access_type: string;
  description: string | null;
  cloud_url: string;

}



