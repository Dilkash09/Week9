import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.html',
  styleUrls: ['./edit-product.css']
})
export class EditProduct implements OnInit {
  productForm: FormGroup;
  loading = false;
  loadingProduct = true;
  error: string | null = null;
  productId: string | null = null;
  originalProduct: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0)]],
      units: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct();
    } else {
      this.error = 'Invalid product ID';
      this.loadingProduct = false;
    }
  }

  loadProduct(): void {
    this.loadingProduct = true;
    this.productService.getProduct(this.productId!).subscribe({
      next: (response) => {
        this.originalProduct = response.product;
        this.productForm.patchValue({
          name: response.product.name,
          description: response.product.description,
          price: response.product.price,
          units: response.product.units
        });
        this.loadingProduct = false;
      },
      error: (err) => {
        this.error = 'Failed to load product. Please try again.';
        this.loadingProduct = false;
        console.error('Error loading product:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const updatedProduct: Product = {
      ...this.originalProduct!,
      ...this.productForm.value
    };

    this.productService.updateProduct(this.productId!, updatedProduct).subscribe({
      next: (response) => {
        alert('Product updated successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to update product. Please try again.';
        this.loading = false;
        console.error('Error updating product:', err);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  // Helper methods for template
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get units() { return this.productForm.get('units'); }
}