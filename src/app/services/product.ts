// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class Product {
  
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products`);
  }

  // Get product by ID
  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  // Add new product
  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product, {
      headers: this.getHeaders()
    });
  }

  // Update product
  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, product, {
      headers: this.getHeaders()
    });
  }

  // Delete product
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`);
  }

  // Add sample products
  addSampleProducts(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-products`, {});
  }
  
}