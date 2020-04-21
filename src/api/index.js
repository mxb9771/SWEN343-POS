import request from 'request-promise';
import Cookie from "js-cookie";
import queryString from 'query-string';
import * as user_types from '../redux/user_types';

const ec2_url = 'ec2-18-219-237-195.us-east-2.compute.amazonaws.com:8080';
const cors_proxy_url = 'https://cors-anywhere.herokuapp.com/';
export const hr_login_url = 'http://ec2-3-82-117-119.compute-1.amazonaws.com/singlesignon/'
const get_user_link = 'http://ec2-3-82-117-119.compute-1.amazonaws.com/api/Token?token='

export const handleAuthentication = async (search, login, user_type) => {
    if (user_type === user_types.CUSTOMER) { // if we haven't already set redux state
        let token = Cookie.get("token") ? Cookie.get("token") : null;

        if (token === null) {
            token = queryString.parse(search).token;
        }

        // if token exists in url params or from JWT, else we remain a customer        
        if (token) {
            const user = JSON.parse(await getUserFromToken(token));
            login({ ...user, token });
            window.history.pushState({}, document.title, "/" + "");
        }
    }
}

export const getAllProducts = () => {
    return request(cors_proxy_url + `${ec2_url}/product/refresh`);
}

export const getUserFromToken = token => {
    return request(cors_proxy_url + `${get_user_link}${token}`)
}

export const makeOrder = (order, total, name, address, salesPersonId, salesManagerId) => {
    let netProfit = parseFloat(total * 0.96)
    if (salesPersonId === '') netProfit = parseFloat(total * 1.00)
    
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
}

export const getAllOrders = () => {
    return request(cors_proxy_url + `${ec2_url}/order/all`);
}

export const getOrderStats = () => {
    return request(cors_proxy_url + `${ec2_url}/order/stats`);
}

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
}

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
}