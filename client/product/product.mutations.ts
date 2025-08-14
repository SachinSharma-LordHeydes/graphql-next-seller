import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: CreateProductInput!) {
    addProduct(input: $input) {
      id
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation AddProduct($input: CreateProductInput!) {
    addProduct(input: $input) {
      id
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      id
    }
  }
`;
