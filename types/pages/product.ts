export interface SpecificationField {
  key: string;
  label: string;
  placeholder: string;
}

export interface Subcategory {
  value: string;
  label: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface Media {
  url: string;
  altText?: string;
  caption?: string;
  type?: string;
  mediaType: "image" | "video";
}

export interface FormData {
  title: string;
  brandId: string;
  categoryId: string;
  subcategory: string;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  specificationDisplayFormat: "bullet" | "table";
  price: string;
  sku: string;
  stock: string;
  comparePrice: string;
  costPrice: string;
  trackQuantity: boolean;
  productMedia: Media[];
  promotionalMedia: Media[];
  weight: string;
  dimensions: string;
  shippingClass: string;
  returnPolicy: string;
  warranty: string;
}

export interface Errors {
  [key: string]: string;
}

export interface SpecificationFields {
  [category: string]: {
    [subcategory: string]: SpecificationField[];
  };
}

export interface Subcategories {
  [category: string]: Subcategory[];
}
