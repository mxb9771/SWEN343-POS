import axios from 'axios';

const ec2_url = 'http://ec2-3-12-198-129.us-east-2.compute.amazonaws.com:8080';
const headers = {
    'Content-Type': 'application/json'
}

export const getProducts = () => {
    // axios.get('')
    //     .then(res => {

    //     });
    return [
        // NOTE: stub for an API call made to inventory service for current products and their inventory counts
        { id: 0, name: 'Product A', price: 100, count: 5 },
        { id: 1, name: 'Product B', price: 110, count: 4 },
        { id: 2, name: 'Product C', price: 80, count: 3 },
        { id: 3, name: 'Product D', price: 95, count: 6 }
    ]
}

export const makeOrder = (order, total, customerId) => {
    const body = {
        customerId,
        totalPrice: total,
        netProfit: total - 100,
        // itemList: order
    }

    axios.post(`${ec2_url}/order/add`, body, { headers })
        .then(res => console.log(res))
   
    alert('Sale Made!')
}

export const makeRefund = async (orderId) => {
    const body = {
        orderId,
        description: 'Product Refund'
    }

    axios.post(`${ec2_url}/order/refund`, body, { headers })
        .then(res => console.log(res))
   
    alert('Refund Made!')
}