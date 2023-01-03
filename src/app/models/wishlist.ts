import { Product } from "./product";

export class Wishlist {
    wishlistId?: number;
    fk_ProductId?: number;
    fk_UserId?: number;

    constructor(fk_productId: number, fk_userId: number) {
        this.fk_ProductId = fk_productId;
        this.fk_UserId = fk_userId;
    }
}