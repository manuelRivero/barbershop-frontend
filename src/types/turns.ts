export interface Event {
  name?:string;
  barber?: string;
  _id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: 'COMPLETE' | 'INCOMPLETE';
  scheduleUser: string
}

export interface TurnSelectItem {
  startDate: Date;
}
