import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../service/ProductService';
import { Product } from '../../model/Product';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-place-order',
  imports: [ProductCardComponent, NgFor],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css',
})
export class PlaceOrderComponent implements OnInit {
  cartItems: any;
  totalAmount: any;
  orderService: any;
  ngOnInit(): void {
    this.loadProductsTable();
  }

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  product: Product = new Product('', '', 0, '');

  productList: Product[] = [];

  loadProductsTable() {
    this.productService.loadProducts().subscribe((productList: Product[]) => {
      this.productList = productList;
    });
  }

  cart: any[] = [];

  addToCart(product: Product) {
    const existingProduct = this.cart.find(
      (item) => item.product.code === product.code
    );

    if (existingProduct) {
      existingProduct.qty++;
    } else {
      this.cart.push({ product, qty: 1 });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  getTotalAmount(): number {
    return this.cart.reduce(
      (total, item) => total + item.product.price * item.qty,
      0
    );
  }

  placeOrder() {
    if (this.cart.length === 0) {
      alert('YOUR CART IS EMPTY');
      return;
    }

    const order = {
      totalAmount: this.getTotalAmount(),
      orderDetails: this.cart.map((item) => ({
        product: {
          code: item.product.code,
          name: item.product.name,
          price: item.product.price,
        },
        qty: item.qty,
        total: item.product.price * item.qty,
      })),
    };
    this.http.post('http://localhost:8080/order/place-order', order).subscribe({
      next: (response) => {
        alert('ORDER PLACED SUCCESSFULLY');
        this.cart = [];
      },
    });
  }
  
}
