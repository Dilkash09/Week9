import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct {
  productForm: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      id: [0, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0)]],
      units: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
  if (this.productForm.invalid) {
    this.markFormGroupTouched();
    return;
  }

  this.loading = true;
  this.error = null;
  this.successMessage = null;

  // Get the form values properly
  const formValue = this.productForm.value;
  
  // Create the product data object with proper typing
  const productData = {
    id: parseInt(formValue.id), // Convert to number
    name: formValue.name?.trim(),
    description: formValue.description?.trim(),
    price: parseFloat(formValue.price), // Convert to number
    units: parseInt(formValue.units) // Convert to number
  };

  // Validate that all values are valid numbers
  if (isNaN(productData.id) || isNaN(productData.price) || isNaN(productData.units)) {
    this.error = 'Please enter valid numeric values for ID, Price, and Units.';
    this.loading = false;
    return;
  }

  this.productService.addProduct(productData).subscribe({
    next: (response) => {
      this.loading = false;
      this.successMessage = 'Product added successfully!';
      
      // Reset form after successful submission
      this.productForm.reset({
        id: 0,
        name: '',
        description: '',
        price: 0,
        units: 0
      });
      
      // Optionally navigate to products list after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 2000);
    },
    error: (err) => {
      this.loading = false;
      this.error = err.error?.error || 'Failed to add product. Please try again.';
      console.error('Error adding product:', err);
    }
  });
}

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/products']);
    }
  }

  // Helper methods for template access
  get id() { return this.productForm.get('id'); }
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get units() { return this.productForm.get('units'); }

  // Validation helper methods
  shouldShowError(control: any): boolean {
    return control?.invalid && (control?.dirty || control?.touched);
  }

  getErrorMessage(control: any): string {
    if (control?.errors?.['required']) {
      return 'This field is required';
    }
    if (control?.errors?.['min']) {
      return 'Value must be greater than 0';
    }
    if (control?.errors?.['maxlength']) {
      return `Maximum length exceeded`;
    }
    return '';
  }
}