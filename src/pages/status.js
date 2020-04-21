// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/action_types';
import * as api from '../api';
import * as user_types from '../redux/user_types';
import { Header, Modal } from '../components';
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

class Status extends Component {
    INITIAL_STATE = {
      orderId: '',
      isModalShowing: false,
      status: ''
    }

    state = this.INITIAL_STATE

    componentWillMount () {
      api.handleAuthentication(window.location.search, this.props.login, this.props.user_type);  
    }

    render () {
        return (
            <PageContainer>
                { this.state.isModalShowing && (
                    <Modal close={this.hideModal.bind(this)}>
                      <StatusMessage>
                        Order Status: <strong>{this.state.status}</strong>
                      </StatusMessage>
                    </Modal>
                  )
                }
                <Header
                  page="/status"
                  user={`${this.props.first_name} ${this.props.last_name} (${this.props.user_type})`}
                  isAuthenticated={this.props.user_type !== user_types.CUSTOMER}
                  navigate={this.navigate.bind(this)}
                  logout={this.handleLogout.bind(this)} 
                  user_type={this.props.user_type}
                />
                <FormContainer>
                    <FormHeader>Check Order Status</FormHeader>
                    <CustomerEntry>
                        <Label>Order ID</Label>
                        <NameInput value={this.state.orderId} onChange={this.handleOrderChange.bind(this)} />
                    </CustomerEntry>
                    <SubmitButton
                        disabled={this.state.orderId === ''} 
                        onClick={this.state.orderId !== '' ? this.handleStatusButtonClick.bind(this) : null}
                    >
                        Check
                    </SubmitButton>
                </FormContainer>
            </PageContainer>
        );
    }

    // helpers

    handleStatusButtonClick () {
        api.getOrderStatus(this.state.orderId)
          .then(res => this.setState({
            orderId: '', status: res, isModalShowing: true
          }))
    }

    handleOrderChange (event) {
      this.setState({ orderId: event.target.value });
    }

    showModal () {
      this.setState({ isModalShowing: true });
    }

    hideModal () {
      this.setState({ isModalShowing: false, status: '' });
    }

    handleLogout () {
        this.setState(this.INITIAL_STATE)
        this.props.logout();
    }

    navigate (to) {
      this.props.history.push(to);
  }
}

// styled:

const StatusMessage = styled.div`
  font-size: 20px;
  color: #000;
`;

// redux:

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: types.LOGOUT }),
        login: payload => dispatch({ type: types.LOGIN, payload })
    }
}

const mapStateToProps = state => {
    const { uid, user_type, first_name, last_name } = state;

    return {
        uid,
        user_type,
        first_name,
        last_name
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Status);