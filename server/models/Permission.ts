export interface Permission {
    user_id: number;
    can_read: boolean;
    can_write: boolean;
    can_delete: boolean;
    role:string;
    is_active:boolean;
  }
  
 