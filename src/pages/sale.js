// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';


// local imports:

import style from '../style';
import * as types from '../redux/action_types';
import * as user_types from '../redux/user_types';
import * as api from '../api';
import { Header, Modal } from '../components';
import {
    PageContainer,
    FormHeader,
    FormContainer,
    SubmitButton,
    CustomerEntry,
    NameInput,
    Label,
    Table,
    TableBody,
    TableRow,
    HeaderRow,
    TableHeader,
    TableData
  } from './styled';

// component

class Sale extends Component {
    INITIAL_STATE = {
        order: {},
        products: [],
        total: 0.0,
        numItems: 0,
        isButtonActive: false,
        name: '',
        address: '',
        isInStock: true,
        orderId: '',
        loading: true,
        isModalShowing: false,
    }

    state = this.INITIAL_STATE

    componentWillMount () {
        api.getAllProducts()
            .then(res => this.setState({ order: this.getOrder(JSON.parse(res)), products: JSON.parse(res), loading: false }))
    }

    render () {
        if (this.state.loading) return <div style={{ fontSize: 35, marginTop: 10, marginLeft: 10 }}>... Loading</div>
        return (
            <PageContainer>
                { this.state.isModalShowing && (
                    <Modal close={this.hideModal.bind(this)}>
                      <SaleMessage>
                        Order ID: <strong>{this.state.orderId}</strong>
                      </SaleMessage>
                    </Modal>
                  )
                }
                <Header navigate={this.navigate.bind(this)} logout={this.handleLogout.bind(this)} user_type={this.props.user_type} />
                <FormContainer>
                    <FormHeader>{this.props.user_type === user_types.SALES_REP ? 'Make a Sale' : 'Make a Purchase'}</FormHeader>
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
                                        count={p.stock}
                                        pricePer={this.state.order[p.id].pricePer || ''}
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

    Product = ({ id, name, pricePer, quantity, handleQuantityChange, handlePriceChange, isActive, count }) => {
        return (
            <>
                <TableRow>
                    <TableData isActive={isActive} width={200}>{name}</TableData>
                    <TableData isActive={isActive} width={30}>{count}</TableData>
                    <TableData isActive={isActive} width={50}>
                        { this.props.user_type === user_types.CUSTOMER &&
                            ('$ ' + pricePer)
                        }
                        { this.props.user_type !== user_types.CUSTOMER &&
                            (   <>
                                    <p style={{ display: 'inline' }}>{`$   `}</p>
                                    <TableInput 
                                        onChange={(event) => handlePriceChange(event, id)}
                                        type="text"
                                        pattern="[0-9]*"
                                        value={pricePer} 
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
            item.pricePer = parseFloat(p.price)
            item.quantity = 0
            order.push(item)
        })
        return order;
    }

    showModal () {
        this.setState({ isModalShowing: true });
    }
  
    hideModal () {
        this.setState({ isModalShowing: false, orderId: '' });
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
        order[id].pricePer = parseFloat(event.target.value)
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
        let total = 0.0
        Object.entries(this.state.order).forEach((item) => {
            const { pricePer, quantity } = item[1];
            total += parseFloat(pricePer * quantity);
        })

        this.setState({ total }, () => this.setButtonActive())
    }

    setButtonActive () {
        let isCustomerReqMet = this.state.name !== '' && this.state.address !== '';
        let isButtonActive = this.state.total > 0 && (this.props.user_type !== user_types.CUSTOMER || this.state.isInStock) && isCustomerReqMet;
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
        this.setState({ loading: true })
        api.makeOrder(order, total, name, address, this.props.uid)
            .then(res => {
                this.setState(this.INITIAL_STATE)
                this.setState({ products, order: this.getOrder(products), loading: false, isModalShowing: true, orderId: res });
            });
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

const TableInput = styled.input`
    height: 30px;
    width: 50px;
    padding-left: 10px;
    font-size: 13px;
`;

const SaleMessage = styled.div`
  font-size: 20px;
  color: #000;
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