import { IDeal } from "./dealinterface";

export class Deal implements IDeal {
  dealId?: number;
  fk_Product_Id?: number;
  salePrice?: number;

  constructor (dealId: number, fk_Product_Id: number, salePrice: number) {
    this.dealId = dealId;
    this.fk_Product_Id = fk_Product_Id;
    this.salePrice = salePrice;
  }
}

export class Deal2 implements IDeal {
  dealId?: number;
  fk_Product_Id?: number;
  salePrice?: number;

  constructor(deal: IDeal) {
    this.dealId = deal.dealId;
    this.fk_Product_Id = deal.fk_Product_Id;
    this.salePrice = deal.salePrice;
  }
}
