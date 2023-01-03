import { Component, OnInit } from '@angular/core';
import { Deal } from 'app/models/deal';
import { DealService } from 'app/services/deal.service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent implements OnInit {

  allProducts: Product[] = [];
  deals: Deal[] = [];

  constructor(private productService: ProductService, private dealService: DealService) { }

  ngOnInit(): void {
    this.dealService.getDeals().subscribe(
      (data) => {
        //console.log(data);
        this.deals = data;
      }
    );
    this.productService.getProducts().subscribe(
      (resp) => {
        //
        for (let i = 0; i < resp.length; i++) {
          for (let j = 0; j < this.deals.length; j++) {
            if (resp[i].productId == this.deals[j].fk_Product_Id) {
              resp[i].productPrice = this.deals[j].salePrice || 0;
            }
          }
        }
        //
        this.allProducts = resp;
      },
      (err) => console.log(err),
      () => console.log("Products Retrieved")
    );
  }

}
