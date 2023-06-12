/*
    Build a Node.js program using Selenium to automate the process of testing a web application's registration functionality.
    The program should generate random email addresses and passwords and verify that the registration process is successful.
 */

// Required dependencies and setup
const webdriver = require('selenium-webdriver');
const { By } = webdriver;
const url = "https://magento.softwaretestingboard.com/";
const driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().window().maximize();

// Initializes the WebDriver and starts the registration process
async function init(user) {
    await driver.get(url)
    await registerUser(user, driver);
}

// Performs the registration process
async function registerUser(user, driver) {
    // Clicks on the "Create an Account" link on the homepage
    await driver.findElement(By.xpath('/html/body/div[1]/header/div[1]/div/ul/li[3]/a')).click();
    await fillUserDetails(driver, user);
    await checkPasswordValidity(driver);
    // click on create an account button
    await driver.findElement(By.xpath('//*[@id="form-validate"]/div/div[1]/button')).click();

    await checkEmailValidity(driver);
    await checkConfirmPasswordValidity(driver);

    await printUserRegistrationMsg(driver);
    await driver.quit();

}

// Fills in the user details in the registration form
async function fillUserDetails(driver, user) {
    let { firstname, lastname, email, password, confirmPassword } = user;
    await driver.findElement(By.id('firstname')).sendKeys(firstname);
    await driver.findElement(By.id('lastname')).sendKeys(lastname);
    await driver.findElement(By.id('email_address')).sendKeys(email);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.id('password-confirmation')).sendKeys(confirmPassword);
}

// Checks the validity of the email address
async function checkEmailValidity(driver) {
    try {
        const emailError = await driver.findElement(By.id('email_address-error'));
        if (await emailError.isDisplayed()) {
            errorMessage = await emailError.getText();
            console.log(`Email Error: ${errorMessage}`);
        }
    } catch (err) { }
}

// check if the password is passing the criteria
// 1. password should have more than 8 characters
// 2. password should have UpperCase, LowerCase, Digits and special characters
async function checkPasswordValidity(driver) {
    try {
        const passwordError = await driver.findElement(By.id('password-error'));
        if (await passwordError.isDisplayed()) {
            errorMessage = await passwordError.getText();
            console.log(`Password Error: ${errorMessage}`)
        }
    } catch (err) { }
}

// Checks the validity of the confirm password
async function checkConfirmPasswordValidity(driver) {
    try {
        const passwordConfirmationError = await driver.findElement(By.id('password-confirmation-error'));
        if (await passwordConfirmationError.isDisplayed()) {
            errorMessage = await passwordConfirmationError.getText();
            console.log(`Password Confirmation Error: ${errorMessage}`);
        }
    } catch (err) { }
}

// Prints the user registration message
async function printUserRegistrationMsg(driver) {
    const pageTitle = await driver.getTitle();
    let userDetails;
    try {
        const userDetailsElement = await driver.findElement(By.xpath('//*[@id="maincontent"]/div[2]/div[1]/div[3]/div[2]/div[1]/div[1]/p'));
        userDetails = await userDetailsElement.getText();
        userDetails = userDetails.split("\n");
    } catch (err) {
        
    }

    if (pageTitle === "My Account"
        && userDetails) {
        console.log(`Registration successful!!!`);
        console.log(`Name: ${userDetails[0]}`);
        console.log(`Email: ${userDetails[1]}`);
    } else {
        console.log("Registration unsuccessful!!!");
    }

}

function generateRandomEmail() {
    const emailDomain = 'example.com';
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${randomString}@${emailDomain}`;
}

function generateRandomPassword() {
    const length = Math.floor(Math.random() * 20) + 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function testRandomEmailAndPassword() {
    let user = {
        firstname: 'Test',
        lastname: 'User',
        email: '',
        password: '',
        confirmPassword: ''
    }
    user.email = generateRandomEmail();
    user.password = generateRandomPassword();
    user.confirmPassword = user.password;

    init(user);

}

function testSuccessfulRegistration() {
    let user = {
        firstname: 'Test',
        lastname: 'User',
        email: '',
        password: 'A@123456',
        confirmPassword: 'A@123456'
    }
    user.email = generateRandomEmail();
    //user.email = "a@g.com";
    init(user);
}

function testInvalidEmail() {
    let user = {
        firstname: 'Test',
        lastname: 'User',
        email: 'email',
        password: 'A@123456',
        confirmPassword: 'A@123456'
    }

    init(user);
}

//testSuccessfulRegistration();
//testInvalidEmail();
testRandomEmailAndPassword();


