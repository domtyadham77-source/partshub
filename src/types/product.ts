export type ProductCategory = "Car parts" | "Motorcycle parts" | "Workshop";
export type ProductOffer = { id:string; price:number; stockQuantity:number; stockStatus:"in-stock"|"limited"|"out-of-stock" };
export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  fitment: string;
  price: number;
  seller: string;
  rating?: number;
  description: string;
  stockStatus: "in-stock" | "limited" | "out-of-stock";
  tag?: string;
  imageUrl?: string;
  imageUrls?: string[];
  offerCount?: number;
  offers?: ProductOffer[];
};
