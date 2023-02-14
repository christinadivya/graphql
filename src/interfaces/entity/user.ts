export interface IUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type UserID = number;
