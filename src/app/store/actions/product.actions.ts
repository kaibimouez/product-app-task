import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Dispatches an action to load the list of products.
 * @param searchQuery - The search query string (optional).
 * @param limit - Number of products per page.
 * @param skip - Number of products to skip for pagination.
 */
export const loadProducts = createAction(
  '[Product] Load Products',
  props<{ searchQuery?: string; limit: number; skip: number }>()
);

/**
 * Dispatched when products are successfully loaded.
 * @param products - The retrieved list of products.
 * @param total - Total number of products available.
 * @param skip - The number of skipped products (for pagination).
 * @param limit - The limit of products per request.
 */
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[]; total: number; skip: number; limit: number }>()
);

/**
 * Dispatched when there is an error loading products.
 * @param error - The HTTP error response.
 */
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Dispatches an action to load a single product by ID.
 * @param id - The ID of the product to be loaded.
 */
export const loadProduct = createAction(
  '[Product] Load Product',
  props<{ id: number }>()
);

/**
 * Dispatched when a single product is successfully loaded.
 * @param product - The retrieved product details.
 */
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: Product }>()
);

/**
 * Dispatched when there is an error loading a single product.
 * @param error - The HTTP error response.
 */
export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: HttpErrorResponse }>()
);
