// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/action_types';
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

class Refund extends Component {
    INITIAL_STATE = {
      orderId: ''
    }

    state = this.INITIAL_STATE

    componentWillMount () {
        // if (!this.props.uid) {
        //     this.props.history.push('/login')
        // }

        // let products = api.getProducts();
        // this.setState({ order: this.getOrder(this.state.products) });
    }

    render () {
        return (
            <PageContainer>
                <Header navigate={this.navigate.bind(this)} logout={this.handleLogout.bind(this)} user_type={this.props.user_type} />
                <FormContainer>
                    <FormHeader>Make a Refund</FormHeader>
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

    // helpers

    handleRefundButtonClick () {
        api.makeRefund(this.state.orderId)
        this.setState({ orderId: '' })
    }

    handleOrderChange (event) {
      this.setState({ orderId: event.target.value });
    }

    handleLogout () {
        this.setState(this.INITIAL_STATE)
        this.props.logout();
        this.props.history.push('/login');
    }

    navigate (to) {
      this.props.history.push(to);
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Refund);