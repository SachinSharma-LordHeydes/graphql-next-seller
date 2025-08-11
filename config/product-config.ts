import { SpecificationFields, Subcategories } from "@/types/pages/product";

export const specificationFields: SpecificationFields = {
  electronics: {
    smartphones: [
      { key: "ram", label: "RAM", placeholder: "e.g., 4GB, 8GB" },
      { key: "rom", label: "ROM", placeholder: "e.g., 64GB, 128GB" },
      { key: "color", label: "Color", placeholder: "e.g., Black, White" },
      {
        key: "display",
        label: "Display",
        placeholder: "e.g., 6.5 inches AMOLED",
      },
    ],
  },
  clothing: {
    ladies: [
      { key: "size", label: "Size", placeholder: "e.g., S, M, L" },
      { key: "color", label: "Color", placeholder: "e.g., Red, Blue" },
      {
        key: "length",
        label: "Length",
        placeholder: "e.g., Short, Knee-length",
      },
    ],
  },
};

export const subcategories: Subcategories = {
  electronics: [
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
  ],
  clothing: [
    { value: "ladies", label: "Ladies" },
    { value: "mens", label: "Mens" },
  ],
};

export const steps = [
  { id: 1, title: "Basic Details", description: "Product information" },
  { id: 2, title: "Specifications", description: "Features and details" },
  { id: 3, title: "Pricing & Inventory", description: "Price and stock" },
  { id: 4, title: "Media Upload", description: "Images and videos" },
  { id: 5, title: "Shipping", description: "Delivery options" },
  { id: 6, title: "Policies", description: "Returns and warranty" },
];
