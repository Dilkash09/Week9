// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-product-list',
//   imports: [],
//   templateUrl: './product-list.html',
//   styleUrl: './product-list.css'
// })
// export class ProductList {

// }
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== productId);
        },
        error: (err) => {
          alert('Failed to delete product. Please try again.');
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  addSampleProducts(): void {
    this.productService.addSampleProducts().subscribe({
      next: (response) => {
        alert('Sample products added successfully!');
        this.loadProducts();
      },
      error: (err) => {
        alert('Failed to add sample products. Please try again.');
        console.error('Error adding sample products:', err);
      }
    });
  }
}