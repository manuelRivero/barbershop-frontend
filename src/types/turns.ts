import { User } from "./user";

export interface Event {
  type:string;
  name?: string;
  barber?: string;
  _id?: string;
  startDate: string;
  endDate: string;
  price: number;
  status: 'COMPLETE' | 'INCOMPLETE' | "CANCELED" | "CANCELED-BY-USER";
  user: null | User;
}

export interface TurnSelectItem {
  startDate: any;
  endDate: any;
}
