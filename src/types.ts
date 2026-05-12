export interface Order {
  id: string;
  stationName: string;
  customerName: string;
  platformNumber: string;
  coachSeat: string;
  productId: string;
  amount: number;
  status: 'pending' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}
