import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductPage } from '../store/models/product.model';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  /**
   * Loads a list of products with optional search, limit, and skip parameters.
   * @param searchQuery Optional search query to filter products.
   * @param limit Number of products to load per request.
   * @param skip The number of products to skip (pagination).
   * @returns An observable of ProductPage.
   */
  loadProducts(searchQuery: string = '', limit: number = 20, skip: number = 0): Observable<ProductPage> {
    const url = searchQuery
      ? `${this.baseUrl}/search?q=${searchQuery}&limit=${limit}&skip=${skip}`
      : `${this.baseUrl}?limit=${limit}&skip=${skip}`;

    return this.http.get<ProductPage>(url);
  }

   /**
   * Loads a single product by its ID.
   * @param id The product ID.
   * @returns An observable of Product.
   */
  loadProduct(id: number): Observable<Product> {
    const url = `${this.baseUrl}/${id}`
    return this.http.get<Product>(url);
  }
  
}
