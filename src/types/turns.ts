export interface Event {
  name?:string;
  barber?: string;
  _id?: string;
  title: string;
  startDate: string;
  endDate: string;
  price: number;
  status: 'COMPLETE' | 'INCOMPLETE';
  user: string | null
}

export interface TurnSelectItem {
  startDate: any;
}
