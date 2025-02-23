import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Product } from '../../store/models/product.model';
import { loadProducts } from '../../store/actions/product.actions';
import {  
  selectProducts, 
  selectProductsError, 
  selectProductsLoading, 
  selectSearchQuery, 
  selectSkip, 
  selectTotalProducts
} from '../../store/selectors/product.selectors';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-view',
  templateUrl: './product-list-view.component.html',
  styleUrls: ['./product-list-view.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule]
})
export class ProductListViewComponent implements OnInit {
  products$: Observable<Product[]> = this.store.select(selectProducts);
  loading$: Observable<boolean> = this.store.select(selectProductsLoading);
  error$: Observable<HttpErrorResponse> = this.store.select(selectProductsError);
  total$ = this.store.select(selectTotalProducts);

  searchForm!: FormGroup;

  // Fixed limit set to 20
  limit: number = 20;
  skip: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  searchQuery: string | undefined;

  constructor(
    private store: Store, 
    private formBuilder: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.restoreState();
    this.setupSearchListener();
    this.calculateTotalPages();
  }

  /**
   * Initializes the search form
   */
  private initializeForm(): void {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }

  /**
   * Calculates the total number of pages available.
   */
  private calculateTotalPages(): void {
    this.total$.subscribe(total => {
      this.totalPages = Math.ceil(total / this.limit);
    });
  }

  /**
   * Restores previous search query and skip values from the store.
   * The limit will always be 20.
   */
  private restoreState(): void {
    this.store.select(selectSearchQuery).subscribe(searchQuery => {
      this.searchQuery = searchQuery;
      this.searchForm.patchValue({ search: searchQuery || '' }, { emitEvent: false });
    });

    this.store.select(selectSkip).subscribe(skip => {
      this.skip = skip;
      this.currentPage = Math.floor(skip / this.limit) + 1;
    });

    this.loadProducts();
  }

  /**
   * Sets up the search input field to listen for changes.
   */
  private setupSearchListener(): void {
    const searchSub = this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchQuery => {
      this.searchQuery = searchQuery;
      this.currentPage = 1;
      this.skip = 0;
      this.loadProducts();
    });
  }

  /**
   * Dispatches the action to load products based on search query, limit (always 20), and skip.
   */
  loadProducts(): void {
    this.store.dispatch(loadProducts({ searchQuery: this.searchQuery, limit: this.limit, skip: this.skip }));
  }

  /**
   * Navigates to a product details page.
   * @param productId - The ID of the selected product.
   */
  loadProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  /**
   * Moves to the next page of products.
   */
  nextProductPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.skip = (this.currentPage - 1) * this.limit;
      this.loadProducts();
    }
  }

  /**
   * Moves to the previous page of products.
   */
  previousProductPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.skip = (this.currentPage - 1) * this.limit;
      this.loadProducts();
    }
  }

  /**
   * Checks if the next page button should be disabled (if it's the last page).
   */
  isNextPageDisabled(): boolean {
    return this.currentPage >= this.totalPages;
  }

  /**
   * Retries loading products in case of an error.
   */
  retry(): void {
    this.loadProducts();
  }
}
