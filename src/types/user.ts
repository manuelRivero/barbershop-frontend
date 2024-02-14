export interface User {
  name: string;
  lastname: string;
  avatar?: string;
  avatarId?: string;
  email: string;
  _id: string;
  role: string;
  commission?: number;
  score?:number;
  isActive: boolean;
  phone?:string
}
