import {Selector, t} from 'testcafe'

class LoginPage{

    constructor(){
        this.emailInput = Selector('input#exampleInputEmail1');
        this.passwordInput = Selector('input#exampleInputPassword1');
        this.loginBtn = Selector('button#login');
    }

    async setUserName(userName){ 
        await t.typeText(this.userNameInput, userName)
    }

    async setPassword(password){
        await t.typeText(this.passwordInput, password);
    }

    async clickOnLoginButton(){
        await t.click(this.loginBtn);
    }

}

export default new LoginPage();