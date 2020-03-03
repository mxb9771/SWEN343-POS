import axios from 'axios';

export const getProducts = () => {
    // axios.get('')
    //     .then(res => {

    //     });
    return [
        { id: 0, name: 'Product A', price: 100, count: 5 },
        { id: 1, name: 'Product B', price: 110, count: 4 },
        { id: 2, name: 'Product C', price: 80, count: 3 },
        { id: 3, name: 'Product D', price: 95, count: 6 }
    ]
}

export const makeSale = ({ quantities, prices, products }) => {
    // axios.post('', {  })
    //     .then(res => {

    //     });
    alert('Sale Made!')
}

export const makeRefund = () => {
    axios.post('', { })
        .then(res => {
            
        });
}