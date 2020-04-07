// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/action_types';
import * as user_types from '../redux/user_types';
import * as api from '../api';
import { Header } from '../components';
import {
    PageContainer,
    FormHeader,
    FormContainer,
    SubmitButton,
    CustomerEntry,
    NameInput,
    Label
  } from './styled';

// component

class Sale extends Component {
    INITIAL_STATE = {
        order: {},
        products: api.getProducts(),
        total: 0,
        numItems: 0,
        isButtonActive: false,
        name: '',
        address: '',
        isInStock: true,
        orderId: ''
    }

    state = this.INITIAL_STATE

    componentWillMount () {
        // let products = api.getProducts();
        let orders = api.getAllOrders();
        console.warn('orders', orders)
        this.setState({ order: this.getOrder(this.state.products) });
    }

    render () {
        return (
            <PageContainer>
                <Header navigate={this.navigate.bind(this)} logout={this.handleLogout.bind(this)} user_type={this.props.user_type} />
                <FormContainer>
                    <FormHeader>{this.props.user_type === 'sales_rep' ? 'Make a Sale' : 'Make a Purchase'}</FormHeader>
                    <CustomerEntry>
                        <Label>Name</Label>
                        <NameInput value={this.state.name} onChange={this.handleCustomerChange.bind(this)} />
                    </CustomerEntry>
                    <CustomerEntry>
                        <Label>Mailing Address</Label>
                        <NameInput value={this.state.address} onChange={this.handleAddressChange.bind(this)} />
                    </CustomerEntry>
                    <Table>
                        <HeaderRow>
                            <TableHeader>Product</TableHeader>
                            <TableHeader>In stock</TableHeader>
                            <TableHeader>Price</TableHeader>
                            <TableHeader>Quantity</TableHeader>
                        </HeaderRow>
                        <TableBody>
                            {   this.state.products.map(p => 
                                    <this.Product
                                        id={p.id}
                                        isActive={this.state.order[p.id] && this.state.order[p.id].quantity > 0}
                                        name={p.name}
                                        count={p.count}
                                        price={this.state.order[p.id].price || ''}
                                        quantity={this.state.order[p.id].quantity || ''}
                                        handleQuantityChange={this.handleQuantityChange.bind(this)}
                                        handlePriceChange={this.handlePriceChange.bind(this)}
                                    />
                                )
                            }     
                            <TableRow>
                            <TableData noFill big>{`${this.state.numItems} item(s) selected`}</TableData>
                                <TableData noFill />
                                <TableData noFill big>Total:</TableData>
                                <TableData noFill big>{'$ ' + this.state.total}</TableData>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <SubmitButton 
                        disabled={!this.state.isButtonActive}
                        onClick={this.state.isButtonActive ? this.handleOrderButtonClick.bind(this) : null}>
                            {this.props.user_type === 'sales_rep' ? 'Complete' : 'Purchase'}
                    </SubmitButton>
                </FormContainer>
            </PageContainer>
        );
    }

    // sub components

    Product = ({ id, name, price, quantity, handleQuantityChange, handlePriceChange, isActive, count }) => {
        return (
            <>
                <TableRow>
                    <TableData isActive={isActive} width={200}>{name}</TableData>
                    <TableData isActive={isActive} width={30}>{count}</TableData>
                    <TableData isActive={isActive} width={50}>
                        { this.props.user_type === 'customer' &&
                            ('$ ' + price)
                        }
                        { this.props.user_type === 'sales_rep' &&
                            (   <>
                                    <p style={{ display: 'inline' }}>{`$   `}</p>
                                    <TableInput 
                                        onChange={(event) => handlePriceChange(event, id)}
                                        type="text"
                                        pattern="[0-9]*"
                                        value={price} 
                                    />
                                </>
                            )
                        }
                    </TableData>
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

    // helpers

    getOrder (products) {
        let order = []
        products.forEach(p => {
            let item = {}
            item.itemId = p.id
            item.price = p.price
            item.quantity = 0
            order.push(item)
        })
        return order;
    }

    handleCustomerChange (event) {
        this.setState({ name: event.target.value }, () => this.setButtonActive());
    }

    handleAddressChange (event) {
        this.setState({ address: event.target.value }, () => this.setButtonActive());
    }

    handleOrderChange (event) {
        this.setState({ orderId: event.target.value });
    }
    
    handleQuantityChange (event, id) {
        let order = this.state.order
        order[id].quantity = parseInt(event.target.value) || 0
        this.setState({ order }, () => {
            this.calculateTotalPrice()
            this.calculateNumberOfItems()
            this.checkStock();
        });
    }
    
    handlePriceChange (event, id) {
        let order = this.state.order
        order[id].price = parseInt(event.target.value)
        this.setState({ order }, () => {
            this.calculateTotalPrice()
        });
    }
    
    calculateNumberOfItems () {
        let count = 0;
        Object.entries(this.state.order).forEach(item => {
            if (item.quantity > 0) {
                count += 1;
            }
        })
        this.setState({ numItems: count })
    }
    
    calculateTotalPrice () {
        let total = 0
        Object.entries(this.state.order).forEach((item) => {
            const { price, quantity } = item[1];
            total += price * quantity;
        })

        this.setState({ total }, () => this.setButtonActive())
    }

    setButtonActive () {
        let isCustomerReqMet = this.state.name !== '' && this.state.address !== '';
        let isButtonActive = (this.state.total > 0 || this.props.user_type !== user_types.CUSTOMER) && this.state.isInStock && isCustomerReqMet;
        this.setState({ isButtonActive })
    }

    checkStock () {
        Object.entries(this.state.order).forEach((item) => {
            const quantity = item.quantity
            const id = item[0]
            if (this.state.products[id].count < quantity) {
                this.setState({ isInStock: false })
                return;
            }
            this.setState({ isInStock: true })
        })
    }

    handleOrderButtonClick () {
        const { order, total, name, address, products } = this.state;
        api.makeOrder(order, total, name, address)
        this.setState(this.INITIAL_STATE)
        this.setState({ products, order: this.getOrder(products) });
    }

    navigate (to) {
        this.props.history.push(to);
    }

    handleLogout () {
        this.setState(this.INITIAL_STATE)
        this.props.logout();
        this.props.history.push('/login')
    }
}

// styled components:

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
    font-size: ${props => props.big ? '18px' : ''};
    /* &:hover {
        background-color: #16a085;
    } */
`;

const TableInput = styled.input`
    height: 30px;
    width: 50px;
    padding-left: 10px;
    font-size: 13px;
`;

// redux:

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: types.LOGOUT }),
    }
}

const mapStateToProps = state => {
    const { uid, user_type } = state;

    return {
        uid,
        user_type
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sale);