export class Product {
    productId: number;
    productName: string;
    productQuantity: number;
    productPrice: number;
    productDescription: string;
    productImage: string;

    constructor (productId: number, productName: string, productQuantity: number, productDescription: string, productPrice : number, productImage: string) {
        this.productId = productId;
        this.productName = productName;
        this.productQuantity = productQuantity;
        this.productDescription = productDescription;
        this.productPrice = productPrice ;
        this.productImage = productImage;

    }
}
