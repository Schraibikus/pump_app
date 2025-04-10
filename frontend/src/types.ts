export interface Product {
  id: number;
  src: string;
  width: number;
  path: string;
  name: string;
  drawing?: number | null;
  head: number;
  parts: PartItem[];
}

export interface PartItem {
  id: number;
  productId: number;
  partId?: number;
  parentProductId: Product["id"];
  productName: Product["name"];
  productDrawing?: Product["drawing"];
  position: number;
  name: string;
  description?: string;
  designation?: string;
  quantity: number;
  drawing?: number | null;
  positioningTop?: number | null;
  positioningLeft?: number | null;
  positioningTop2?: number | null;
  positioningLeft2?: number | null;
  positioningTop3?: number | null;
  positioningLeft3?: number | null;
  positioningTop4?: number | null;
  positioningLeft4?: number | null;
  positioningTop5?: number | null;
  positioningLeft5?: number | null;

  alternativeSets?: {
    [setName: string]: {
      position: number;
      name: string;
      description?: string;
      designation?: string;
      quantity: number;
      drawing?: number | null;
    };
  };
  selectedSet?: string;
  comment?: string;
}

export interface Order {
  id: number;
  createdAt: string;
  parts: PartItem[];
}

export interface PatchOrderPayload {
  orderId: number;
  changes: {
    addItems?: Array<{
      partId: number;
      parentProductId: number;
      productName: string;
      productDrawing?: number | null;
      position: number;
      name: string;
      description?: string;
      designation?: string;
      quantity: number;
      drawing?: number | null;
      comment?: string;
    }>;
    removeItems?: Array<{ id: number }>;
    updateItems?: Array<{ id: number; quantity: number }>;
    updateComments?: Array<{ id: number; comment: string }>;
    removeComments?: Array<{ id: number }>;
  };
}