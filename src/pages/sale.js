// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/types';
import * as api from '../usecases';

// component

const INITIAL_STATE = {
    quantities: { },
    prices: { },
    products: [],
    total: 0,
    numItems: 0,
    isButtonActive: false,
    customerId: '',
    isInStock: true
}

class Sale extends Component {
    state = INITIAL_STATE

    componentDidMount () {
        if (!this.props.uid) {
            this.props.history.push('/login')
        }


        let products = api.getProducts();
        this.setState({ products, prices: this.getPrices(products) });
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
                                        isActive={this.state.quantities[p.id] && this.state.quantities[p.id] > 0}
                                        name={p.name}
                                        count={p.count}
                                        price={this.state.prices[p.id] || null}
                                        quantity={this.state.quantities[p.id] || null}
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
                        onClick={this.state.isButtonActive && this.handleButtonClick.bind(this)}>Submit</SubmitButton>
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

    getPrices (products) {
        let prices = {}
        products.forEach(p => {
            prices[p.id] = p.price
        })
        return prices;
    }

    handleCustomerChange (event) {
        this.setState({ customerId: event.target.value }, () => this.setButtonActive());
    }
    
    handleQuantityChange (event, id) {
        let quantities = this.state.quantities
        quantities[id] = event.target.value
        this.setState({ quantities }, () => {
            this.calculateTotalPrice()
            this.calculateNumberOfItems()
            this.checkStock();
        });
    }
    
    handlePriceChange (event, id) {
        let prices = this.state.prices
        prices[id] = event.target.value
        this.setState({ prices }, () => {
            this.calculateTotalPrice()
        });
    }
    
    calculateNumberOfItems () {
        let count = 0;
        Object.entries(this.state.quantities).forEach(item => {
            if (item[1] > 0) {
                count += 1;
            }
        })
        this.setState({ numItems: count })
    }
    
    calculateTotalPrice () {
        let total = 0
        Object.entries(this.state.quantities).forEach((item) => {
            const price = this.state.prices[item[0]]
            const quantity = item[1]
            total += parseInt(price * quantity);
        })

        this.setState({ total }, () => this.setButtonActive())
    }

    setButtonActive () {
        let isCustomerReqMet = this.props.user_type === 'customer' || this.state.customerId !== '';
        let isButtonActive = this.state.total > 0 && this.state.isInStock && isCustomerReqMet;
        this.setState({ isButtonActive })
    }

    checkStock () {
        Object.entries(this.state.quantities).forEach((item) => {
            const quantity = item[1]
            const id = item[0]
            if (this.state.products[id].count < quantity) {
                this.setState({ isInStock: false })
                return;
            }
            this.setState({ isInStock: true })
        })
    }

    handleButtonClick () {
        const { quantities, prices, products } = this.state;
        api.makeSale({ quantities, prices, products })
        this.setState({ quantities: {}})
    }

    handleLogout () {
        this.setState(INITIAL_STATE)
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
    }
    margin: 25px 0;
    align-self: flex-start;
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