import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../reducers/product.reducer';

export const selectProductsState = createFeatureSelector<ProductState>('products');
export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectProducts = createSelector(
  selectProductsState,
  (state: ProductState) => state.products
);

export const selectTotalProducts = createSelector(
  selectProductsState,
  (state: ProductState) => state.total
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectSkip = createSelector(
  selectProductsState,
  (state: ProductState) => state.skip
);

export const selectProduct = createSelector(
  selectProductState,
  (state: ProductState) => state.product
);

export const selectProductLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectProductError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectSearchQuery = createSelector(
  selectProductState,
  (state: ProductState) => state.searchQuery
);

