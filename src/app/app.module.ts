import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routes';
import { App } from './app';
import { ProductList } from './components/product-list/product-list';
import { AddProduct } from './components/add-product/add-product';
import { EditProduct } from './components/edit-product/edit-product';

@NgModule({
  declarations: [
    App,
    ProductList,
    AddProduct,
    EditProduct
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule // Only ReactiveFormsModule now
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }