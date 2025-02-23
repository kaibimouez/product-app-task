import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ProductService } from '../../services/product.service';
import { loadProducts, loadProductsSuccess, loadProductsFailure, loadProduct, loadProductSuccess, loadProductFailure } from '../actions/product.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product, ProductPage } from '../models/product.model';


@Injectable()
export class ProductEffects {

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  /**
   * Effect to load products with pagination and optional search query.
   */
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap((action) =>
        this.productService.loadProducts(action.searchQuery, action.limit, action.skip).pipe(
          map((productPage: ProductPage) => {
            return loadProductsSuccess({
              products: productPage.products,
              total: productPage.total,
              skip: productPage.skip,
              limit: productPage.limit
            });
          }),
          catchError((error) => {
            return of(loadProductsFailure({ error }));
          })
        )
      )
    )
  );

  /**
   * Effect to load a single product by ID.
   */
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      switchMap((action) =>
        this.productService.loadProduct(action.id).pipe(
          map((product: Product) => {
            return loadProductSuccess({
              product: product,
            });
          }),
          catchError((error) => {
            return of(loadProductFailure({ error }));
          })
        )
      )
    )
  );
}
