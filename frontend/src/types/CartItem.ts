import { ReactNode } from "react";

export interface CartItem {
  quantity: ReactNode;
  bookId: number;
  title: string;
  price: number;
}
