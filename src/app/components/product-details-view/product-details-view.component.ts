import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { loadProduct } from '../../store/actions/product.actions';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../store/models/product.model';
import { selectProduct, selectProductError, selectProductLoading } from '../../store/selectors/product.selectors';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-details-view',
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './product-details-view.component.html',
  styleUrls: ['./product-details-view.component.scss']
})
export class ProductDetailsViewComponent implements OnInit {
  product$: Observable<Product | null>;
  mainImage: string | undefined;
  loading$: Observable<boolean>;
  error$: Observable<HttpErrorResponse>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private location: Location
  ) {
    // Set up observables
    this.product$ = this.store.pipe(select(selectProduct));
    this.loading$ = this.store.pipe(select(selectProductLoading));
    this.error$ = this.store.pipe(select(selectProductError));
  }

  ngOnInit(): void {
    const productId = this.getProductIdFromRoute();
    if (productId) {
      this.loadProductDetails(productId);
    }
  }

  /**
   * Helper method to get the product ID from the route parameters
   */
  private getProductIdFromRoute(): number | null {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? Number(id) : null;
  }

  /**
   * Dispatches the action to load the product based on its ID
   * @param productId - The ID of the product
   */
  private loadProductDetails(productId: number): void {
    this.store.dispatch(loadProduct({ id: productId }));
  }

  /**
   * Changes the main image being displayed in the product view
   * @param image - The image to display
   */
  changeMainImage(image: string): void {
    this.mainImage = image;
  }

  /**
   * Goes back to the previous page
   */
  goBack(): void {
    this.location.back();
  }
}
