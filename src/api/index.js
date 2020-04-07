import request from 'request-promise';

const ec2_url = 'http://ec2-3-135-232-182.us-east-2.compute.amazonaws.com:8080';
const cors_proxy_url = 'https://cors-anywhere.herokuapp.com/';

export const getAllProducts = () => {
    return request(cors_proxy_url + `${ec2_url}/product/refresh`);
}

export const makeOrder = (order, total, name, address, salesPersonId) => {
    let netProfit = parseFloat(total * 0.96)
    if (salesPersonId === '') netProfit = parseFloat(total * 0.99)
    
    var options = {
        method: 'POST',
        uri: cors_proxy_url + `${ec2_url}/order/add`,
        body: {
            name,
            address,
            salesPersonId,
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