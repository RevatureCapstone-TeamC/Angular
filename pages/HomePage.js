import {Selector, t} from 'testcafe'

class HomePage{

    constructor(){
        this.logoutBtn = Selector('button#logout2');
        this.homeBtn = Selector('button#home');
        this.wishlistBtn = Selector('button#wishlist');
    }

    async clickOnLogoutButton(){
        await t
        .click(this.logoutBtn);
    }

    async clickOnHomeButton(){
        await t
        .click(this.homeBtn);
    }

    async clickOnWishlistButton(){
        await t
        .click(this.wishlistBtn);
    }

}

export default new HomePage();