export class Cart {
    cartId?: number;
    fk_ProductID?: number;
    fk_UserID?: number;

    constructor(fk_productId: number, fk_userId: number) {
        this.fk_ProductID = fk_productId;
        this.fk_UserID = fk_userId;
    }
}