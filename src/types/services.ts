export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  images: {url:string, publicId: string}[];
}
