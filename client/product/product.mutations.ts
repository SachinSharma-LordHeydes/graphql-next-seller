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
