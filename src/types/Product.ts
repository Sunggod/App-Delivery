// src/types/Product.ts

export interface Product {
    id: string | number;
    name: string;
    price: number;
    imageURL?: string;
    rating?: number;
    isPromotionActive: boolean;
  }
  
  export interface Category {
    id: string | number;
    name: string;
  }