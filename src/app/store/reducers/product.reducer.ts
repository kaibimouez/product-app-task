import { createReducer, on } from '@ngrx/store';
import { Product } from '../models/product.model';
import { loadProductsSuccess, loadProductsFailure, loadProducts, loadProduct, loadProductSuccess, loadProductFailure } from '../actions/product.actions';

export interface ProductState {
  products: Product[];
  product: Product | null;
  total: number;
  skip: number;
  limit: number;
  loading: boolean;
  error: any;
  searchQuery: string | undefined;
}

export const initialState: ProductState = {
  products: [],
  product : null,
  total: 0,
  skip: 0,
  limit: 20,
  loading: false,
  error: null,
  searchQuery: ''
};

export const productReducer = createReducer(
  initialState,
  on(loadProducts, (state, {searchQuery}) => ({
    ...state,
    loading: true,
    searchQuery: searchQuery
  })),
  on(loadProductsSuccess, (state, { products, total, skip, limit }) => ({
    ...state,
    products,
    total,
    skip,
    limit,
    loading: false,
    error: null
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(loadProduct, (state) => ({
    ...state,
    product: null,
    loading: true,
    error: null,
  })),
  on(loadProductSuccess, (state, { product }) => ({
    ...state,
    product,
    loading: false,
    error: null,
  })),
  on(loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
