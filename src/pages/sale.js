// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/types';

const products = [
    { id: 0, name: 'Product A', price: 100 },
    { id: 1, name: 'Product B', price: 110 },
    { id: 2, name: 'Product C', price: 80 },
    { id: 3, name: 'Product D', price: 95 }
]

// component

class Sale extends Component {
    state = {
        quantities: { },
        total: 0
    }

    handleQuantityChange = (event, id) => {
        let quantities = this.state.quantities
        quantities[id] = event.target.value
        this.setState({ quantities });
        this.calculateTotalPrice(quantities)
    }

    calculateTotalPrice = quantities => {
        let total = 0
        Object.entries(quantities).forEach(item => {
            const price = products[item[0]].price
            const quantity = item[1]
            total += parseInt(price * quantity);
        })
        this.setState({ total })
    }

    render () {
        return (
            <PageContainer>
                <FormContainer>
                    <Header>Make a Purchase</Header>
                    <Table>
                        <HeaderRow>
                            <TableHeader>Product</TableHeader>
                            <TableHeader>Price</TableHeader>
                            <TableHeader>Quantity</TableHeader>
                        </HeaderRow>
                        <TableBody>
                            {   products.map(p => 
                                    <this.Product
                                        id={p.id}
                                        isActive={this.state.quantities[p.id]}
                                        name={p.name}
                                        price={p.price}
                                        quantity={this.state.quantities[p.id] || null}
                                        handleQuantityChange={this.handleQuantityChange.bind(this)}
                                    />
                                )
                            }     
                            <TableRow>
                                <TableData noFill></TableData>
                                <TableData noFill>Total:</TableData>
                                <TableData noFill>{'$ ' + this.state.total}</TableData>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <SubmitButton onClick={this.props.makeSale}>Submit</SubmitButton>
                </FormContainer>
            </PageContainer>
        );
    }

    // sub components

    Product = ({ id, name, price, quantity, handleQuantityChange, isActive }) => {
        return (
            <>
                <TableRow>
                    <TableData isActive={isActive} width={200}>{name}</TableData>
                    <TableData isActive={isActive} width={50}>{'$ ' + price}</TableData>
                    <TableData isActive={isActive} width={30}>
                        <TableInput 
                            onChange={(event) => handleQuantityChange(event, id)}
                            type="text"
                            pattern="[0-9]*"
                            value={quantity} 
                        />
                    </TableData>
                </TableRow>
            </>
        );
    }
}

// styled components:

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-family: ${style.font_family};
    max-width: 1000px;
`;


const Header = styled.h1`
    color: black;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const FormContainer = styled.div`
    width: 80%;
    padding: 0 30px 30px 30px;
    background-color: white;
    margin-top: 4%;
    -webkit-box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
    -moz-box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
`;

const Table = styled.table`
    width: 100%;
`;

const HeaderRow = styled.tr`
    height: 90px;
`;

const TableBody = styled.tbody`
    
`;

const TableRow = styled.tr`
    height: 60px;
    width: 100%;
`;

const TableHeader = styled.th`
    
`;

const TableData = styled.td`
    text-align: center;
    padding: 10px;
    background-color: ${props => props.isActive ? "#dddddd" : props.noFill ? "" : "#eeeeee"};
    /* &:hover {
        background-color: #16a085;
    } */
`;

const TableInput = styled.input`
    height: 30px;
    width: 40px;
    padding-left: 10px;
`;

const SubmitButton = styled.div`
    background-color: #16a085;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    &:hover {
        background-color: #168871;
    }
    margin-top: 30px;
`

// redux:

const mapStateToProps = state => {
    const { uid, user_type } = state;

    return {
        uid,
        user_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        makeSale
    }
}

const makeSale = dispatch => {
    dispatch({ type: types.MAKE_SALE })
}

export default connect(mapStateToProps, mapDispatchToProps)(Sale);