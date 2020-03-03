// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/types';
import * as api from '../api';

// component

class Sale extends Component {
    INITIAL_STATE = {
        order: {},
        products: api.getProducts(),
        total: 0,
        numItems: 0,
        isButtonActive: false,
        customerId: '',
        isInStock: true,
        orderId: ''
    }

    state = this.INITIAL_STATE

    componentWillMount () {
        if (!this.props.uid) {
            this.props.history.push('/login')
        }

        // let products = api.getProducts();
        this.setState({ order: this.getOrder(this.state.products) });
    }

    render () {
        return (
            <PageContainer>
                <Logout onClick={this.handleLogout.bind(this)}>Logout</Logout>
                <FormContainer>
                    <Header>{this.props.user_type === 'sales_rep' ? 'Make a Sale' : 'Make a Purchase'}</Header>
                    { this.props.user_type === 'sales_rep' &&
                        ( 
                            <CustomerEntry>
                                <Label>Enter Customer ID</Label>
                                <NameInput value={this.state.customerId} onChange={this.handleCustomerChange.bind(this)} />
                            </CustomerEntry>
                        )
                    }
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
                <FormContainer>
                    <Header>Make a Refund</Header>
                    <CustomerEntry>
                        <Label>Enter Order ID</Label>
                        <NameInput value={this.state.orderId} onChange={this.handleOrderChange.bind(this)} />
                    </CustomerEntry>
                    <SubmitButton 
                        disabled={this.state.orderId === ''} 
                        onClick={this.state.orderId !== '' ? this.handleRefundButtonClick.bind(this) : null}
                    >
                        Refund
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
        this.setState({ customerId: event.target.value }, () => this.setButtonActive());
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
        let isCustomerReqMet = this.props.user_type === 'customer' || this.state.customerId !== '';
        let isButtonActive = this.state.total > 0 && this.state.isInStock && isCustomerReqMet;
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
        const { order, total, customerId, products } = this.state;
        api.makeOrder(order, total, this.props.user_type === 'sales_rep' ? customerId : this.props.uid)
        this.setState(this.INITIAL_STATE)
        this.setState({ products, order: this.getOrder(products) });
    }

    handleRefundButtonClick () {
        api.makeRefund(this.state.orderId)
        this.setState({ orderId: '' })
    }

    handleLogout () {
        this.setState(this.INITIAL_STATE)
        this.props.logout();
        this.props.history.push('/login')
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
    margin-bottom: 4%;
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

const SubmitButton = styled.div`
    background-color: #16a085;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: white;
    cursor: ${props => props.disabled ? '' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1.0};
    font-size: 18px;
    &:hover {
        background-color: ${props => props.disabled ? '#16a085' : '#168871'};
    }
    margin-top: 30px;
`

const CustomerEntry = styled.div`

`;

const NameInput = styled.input`
    height: 30px;
    width: 200px;
    padding-left: 10px;
    font-size: 13px;
`;

const Label = styled.div`
    margin-bottom: 15px;
`;

const Logout = styled.div`
    font-size: 15px;
    color: #555555;
    width: 100px;
    text-align: center;
    cursor: pointer;
    &:hover {
        color: black;
        border-color: black;
    }
    margin: 25px 0;
    margin-left: 10%;
    height: 30px;
    align-self: flex-start;
    border: 2px solid #555555;
    line-height: 30px;
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