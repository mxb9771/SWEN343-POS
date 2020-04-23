// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import * as user_types from '../redux/user_types';
import * as api from '../api';
import { Modal, Container } from '../components';
import {
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

/**
 * Page for making a sale as either
 * 
 * (1) Authenticated sales rep/manager
 * (2) Unauthenticated customer
 * 
 * @component
 */
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
        isLoading: true,
        isModalShowing: false
    };

    constructor(props) {
        super(props);
        this.state = this.INITIAL_STATE;
    }

    async componentWillMount() {
        api.getAllProducts()
            .then(res => this.setState({ order: this.getOrder(JSON.parse(res)), products: JSON.parse(res), isLoading: false }));
    }

    render() {
        return (
            <Container
                user_type={this.props.user_type}
                page="/sale"
                isLoading={this.state.isLoading}
                navigate={this.navigate.bind(this)}
            >
                {this.state.isModalShowing && (
                    <Modal close={this.hideModal.bind(this)}>
                        <SaleMessage>
                            Order ID: <strong>{this.state.orderId}</strong>
                        </SaleMessage>
                    </Modal>
                )
                }
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
                            {this.state.products.map(p =>
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
                        {this.props.user_type === user_types.SALES_REP ? 'Complete' : 'Purchase'}
                    </SubmitButton>
                </FormContainer>
            </Container>
        );
    }

    // sub components:

    /**
     * Component for a single product row in the order table
     * 
     * @param {string} id - product id
     * @param {string} name - total price
     * @param {number} pricePer - price for a single product
     * @param {number} quantity - number of items being ordered
     * @param {function} handleQuantityChange - modify state for quantity
     * @param {funtion} handlePriceChange - modify state for price of producy
     * @param {bool} isActive - are we ordering any?
     * @param {number} count - how many are in stock
     * @component 
     * @return {JSX}
     */
    Product = ({ id, name, pricePer, quantity, handleQuantityChange, handlePriceChange, isActive, count }) => {
        return (
            <>
                <TableRow>
                    <TableData isActive={isActive} width={200}>{name}</TableData>
                    <TableData isActive={isActive} width={30}>{count}</TableData>
                    <TableData isActive={isActive} width={50}>
                        {this.props.user_type === user_types.CUSTOMER &&
                            ('$ ' + pricePer)
                        }
                        {this.props.user_type !== user_types.CUSTOMER &&
                            (<>
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

    /**
     * Convert array of products into state order object
     * 
     * @param {array} products - array of product objects
     * @return {array} order
     */
    getOrder(products) {
        let order = [];
        products.forEach(p => {
            let item = {};
            item.itemId = p.id;
            item.pricePer = parseFloat(p.price);
            item.quantity = 0;
            order.push(item);
        })
        return order;
    }

    /**
     * Set the modal visibility to true
     */
    showModal() {
        this.setState({ isModalShowing: true });
    }

    /**
     * Set the modal visibility to false
     */
    hideModal() {
        this.setState({ isModalShowing: false, orderId: '' });
    }

    /**
     * Input field value change handler for customer name
     * 
     * @param {object} event - object for value changed
     */
    handleCustomerChange(event) {
        this.setState({ name: event.target.value }, () => this.setButtonActive());
    }

    /**
     * Input field value change handler for customer address
     * 
     * @param {object} event - object for value changed
     */
    handleAddressChange(event) {
        this.setState({ address: event.target.value }, () => this.setButtonActive());
    }

    /**
     * Input field value change handler for a product's quantity
     * 
     * @param {object} event - object for value changed
     * @param {number} id - product id which we changed the quantity of
     */
    handleQuantityChange(event, id) {
        let order = this.state.order
        order[id].quantity = parseInt(event.target.value) || 0
        this.setState({ order }, () => {
            this.calculateTotalPrice()
            this.calculateNumberOfItems()
            this.checkStock();
        });
    }

    /**
     * Input field value change handler for a product's price
     * 
     * @param {object} event - object for value changed
     * @param {number} id - product id which we changed the price of
     */
    handlePriceChange(event, id) {
        let order = this.state.order
        order[id].pricePer = parseFloat(event.target.value)
        this.setState({ order }, () => {
            this.calculateTotalPrice()
        });
    }

    /**
     * Calculate the number of items which have been selected
     */
    calculateNumberOfItems() {
        let count = 0;
        Object.entries(this.state.order).forEach(item => {
            if (item[1].quantity > 0) {
                count += 1;
            }
        })
        this.setState({ numItems: count })
    }

    /**
     * Calculate the total price of order
     */
    calculateTotalPrice() {
        let total = 0.0
        Object.entries(this.state.order).forEach((item) => {
            const { pricePer, quantity } = item[1];
            total += parseFloat(pricePer * quantity);
        })

        this.setState({ total }, () => this.setButtonActive())
    }

    /**
     * If these three (messy) boolean coditions pass, then we can submit the order
     * (1) have we actually ordered anything
     * (2) if we're a customer, have we purchased within a inventory stock
     * (3) have we filled out name and address
     */
    setButtonActive() {
        let areShipmentFieldsComplete = this.state.name !== '' && this.state.address !== '';
        let isButtonActive = this.state.total > 0 && (this.props.user_type !== user_types.CUSTOMER || this.state.isInStock) && areShipmentFieldsComplete;
        this.setState({ isButtonActive })
    }

    /**
     * Was a product quantity requested which exceeded its stock?
     */
    checkStock() {
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

    /**
     * Event handler for order button being pressed
     * Modal shows once we get a response
     */
    handleOrderButtonClick() {
        const { order, total, name, address, products } = this.state;
        this.setState({ isLoading: true })
        api.makeOrder(order, total, name, address, this.props.uid, this.props.manager_id)
            .then(res => {
                this.setState(this.INITIAL_STATE)
                this.setState({ products, order: this.getOrder(products), isLoading: false, isModalShowing: true, orderId: res });
            });
    }

    /**
     * Navigate to another page
     */
    navigate(to) {
        this.props.history.push(to);
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

const mapStateToProps = state => {
    const { uid, user_type, manager_id, first_name, last_name } = state;

    return {
        uid,
        user_type,
        manager_id,
        first_name,
        last_name
    };
};

export default connect(mapStateToProps)(Sale);