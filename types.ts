export enum CanvasItemType {
  MOODBOARD = 'MOODBOARD',
  ROOM_PLAN = 'ROOM_PLAN',
  PRODUCT_SUGGESTION = 'PRODUCT_SUGGESTION',
  INVOICE = 'INVOICE',
  LOOK = 'LOOK',
  COLOR_PALETTE = 'COLOR_PALETTE',
}

export interface CanvasItem {
  id: string;
  type: CanvasItemType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  title: string;
  status?: 'pending' | 'complete';
}

export interface Product {
  name: string;
  description: string;
  price: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}