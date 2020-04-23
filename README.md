This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is the frontend code I wrote for a school project which tasked 5 student teams to create single components for a larger ERP
application. I was assigned sales, and wrote all the frontend code. Our component was responsible for:
1. Making orders (Either as a customer, or sales representative)
2. Requesting an order refund
3. Checking all sales and overall sales statistics
4. Checking the status of an order

The focus was definitely not on frontend pixel perfection, but the component works as intended and integrates well.

## Get started
Unzip the file and cd into the project directory. Here you can run:

#### `npm install`
or
#### `yarn`

Install package dependencies

#### `npm start`

Runs the application on localhost:3000

## Usage

If you want to try out the app, here's what you can do:

### Login

This will take you to another team's single sign on portal. I DID NOT write this, but I wrote logic for redirecting, and saving a token as a JWT,
and saving user info from the token in redux.

#### Steps:
1. Click 'Login' button in top right
2. Enter username: 'ejd3081', password: 'password123'
3. You will be redirected back as user 'Ethan Della Posta' DONE!

### Make a sale

#### Steps:
1. Enter customer name, address
2. Enter a number in any product quantity field
3. Optionally, modify the price of that product
4. Click 'Submit'
5. Once complete, modal will pop up with the order id. Copy this value.

### Make a refund/check order status

#### Steps:
1. Navigate to either refund ot status (navigation bar at top)
2. Paste the order ID into the corresponding field
3. Once complete, modal will pop up with status

### Check overall statistics and log of all sales

#### Steps:
1. Navigate to either stats page
2. Here you can see stats and a log of orders




