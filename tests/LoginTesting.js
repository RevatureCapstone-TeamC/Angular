import { ClientFunction } from 'testcafe'
import LoginPage from '../pages/LoginPage'

// const testcafe = await createTestCafe({
//     hostname: 'localhost',
// });
const loginUrl = 'http://localhost:4200/login'
const getUrl = ClientFunction(() => window.location.href);


fixture('Login Page')
.page(loginUrl);

test('Loading Login Page', async t => {
    console.log("Before");
    //await t.wait(10000)
    // .navigateTo('localhost:4200/login')
    // .expect(LoginPage.loginBtn.exists).ok();
    console.log("After");

}).timeouts({pageRequestTimeout: 60000});

test.skip('FORM - Successfully Login', async t => {
    await t.wait(5000);
    LoginPage.setUserName('John@no.com');
    LoginPage.setPassword('JohnDoe');
    LoginPage.clickOnLoginButton();
    const newUrl = await t.eval(() => document.documentURI);
    await t.expect(newUrl).eql('localhost:4200/home');
});