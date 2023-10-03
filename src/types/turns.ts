export interface Event {
  _id: string
  title: string;
  startDate: Date;
  endDate: Date;
  price: number
  status: "COMPLETE" | "INCOMPLETE"
}

export interface TurnSelectItem {
  startDate: Date;
}
