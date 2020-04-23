// external imports:

import request from 'request-promise';
import Cookie from "js-cookie";
import queryString from 'query-string';
import * as user_types from '../redux/user_types';

// constants for api calls:

const ec2_url = 'ec2-18-219-237-195.us-east-2.compute.amazonaws.com:8080';
const cors_proxy_url = 'https://cors-anywhere.herokuapp.com/';
export const hr_login_url = 'http://ec2-3-82-117-119.compute-1.amazonaws.com/singlesignon/';
const get_user_link = 'http://ec2-3-82-117-119.compute-1.amazonaws.com/api/Token?token=';

/**
 * Get user data from token, optionally retrieving token from query string
 * 
 * @param {object} search - query string object
 * @param {function} login - redux action dispatcher
 * @param {string} user_type - type of user authenticated
 */
export const handleAuthentication = async (search, login, user_type) => {
    if (user_type === user_types.CUSTOMER) { 
        // if we haven't already set redux state
        let token = Cookie.get("token") ? Cookie.get("token") : null;

        if (token === null) {
            token = queryString.parse(search).token;
        }

        // if token exists in url params or from JWT       
        if (token) {
            const user = JSON.parse(await getUserFromToken(token));
            login({ ...user, token });
            window.history.pushState({}, document.title, "/" + "");
        }
        // else we remain an unauthenticated customer 
    }
};

/**
 * Fetch all products from backend
 * 
 * @return {JSON} products result body
 */
export const getAllProducts = () => {
    return request(cors_proxy_url + `${ec2_url}/product/refresh`);
};

/**
 * Fetch all products from backend
 * 
 * @param {string} token - authentication token provided by HR
 * @return {JSON} user result body
 */
export const getUserFromToken = (token) => {
    return request(cors_proxy_url + `${get_user_link}${token}`);
};

/**
 * Make a sale
 * 
 * @param {object} order - list of items and quantities
 * @param {number} total - total price
 * @param {string} name - name of customer
 * @param {string} address - address of customer
 * @param {number} salesPersonId - sales rep id number
 * @param {number} salesManagerId - sales manager id number
 * @return {JSON} result body
 */
export const makeOrder = (order, total, name, address, salesPersonId, salesManagerId) => {
    let netProfit = parseFloat(total * 0.96);
    if (salesPersonId === '') netProfit = parseFloat(total * 1.00);
    
    var options = {
        method: 'POST',
        uri: cors_proxy_url + `${ec2_url}/order/add`,
        body: {
            name,
            address,
            salesPersonId,
            salesManagerId,
            totalPrice: parseFloat(total),
            netProfit,
            itemList: order
        },
        json: true
    };
     
    return request(options);
};

/**
 * Fetch all orders from backend
 * 
 * @return {JSON} orders result body
 */
export const getAllOrders = () => {
    var options = {
        method: 'GET',
        uri: cors_proxy_url + `${ec2_url}/order/all`
    }
    return request(options);
};

/**
 * Get overall company order statistics
 * 
 * @return {JSON} order statistics result body
 */
export const getOrderStats = () => {
    var options = {
        method: 'GET',
        uri: cors_proxy_url + `${ec2_url}/order/stats`
    }
    return request(options);
};

/**
 * Get the status of a particular order
 * 
 * @param {string} orderId - order id
 * @return {JSON} order status result body
 */
export const getOrderStatus = orderId => {
    var options = {
        method: 'POST',
        uri: cors_proxy_url + `${ec2_url}/order/status`,
        body: {
            orderId
        },
        json: true
    };
     
    return request(options);
};

/**
 * Refund an order
 * 
 * @param {string} orderId - order id
 * @return {JSON} refund result body
 */
export const makeRefund = orderId => {
    var options = {
        method: 'POST',
        uri: cors_proxy_url + `${ec2_url}/order/rma`,
        body: {
            orderId
        },
        json: true
    };
     
    return request(options);
};