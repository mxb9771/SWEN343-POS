// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import style from '../style';
import * as types from '../redux/action_types';
import * as api from '../api';
import * as user_types from '../redux/user_types';
import { Container, Modal } from '../components';
import {
  FormHeader,
  FormContainer,
  SubmitButton,
  CustomerEntry,
  NameInput,
  Label
} from './styled';

/**
 * Page for checking the status of an order
 * 
 * @component
 */
class Status extends Component {
  INITIAL_STATE = {
    orderId: '',
    isModalShowing: false,
    status: '',
    isLoading: false
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  render() {
    return (
      <Container
        user_type={this.props.user_type}
        page="/status"
        isLoading={this.state.isLoading}
        navigate={this.navigate.bind(this)}
      >
        {this.state.isModalShowing && (
          <Modal close={this.hideModal.bind(this)}>
            <StatusMessage>
              Order Status: <strong>{this.state.status}</strong>
            </StatusMessage>
          </Modal>
        )
        }
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
      </Container>
    );
  }

  // helpers

  /**
   * Event handler for when the get status button is pressed
   * Modal shows once we get a response
   */
  handleStatusButtonClick() {
    this.setState({ isLoading: true });
    api.getOrderStatus(this.state.orderId)
      .then(res => this.setState({
        orderId: '', status: res, isModalShowing: true, isLoading: false
      }));
  }

  /**
   * Input field value change handler for order id
   * 
   * @param {object} event - object for value changed
   */
  handleOrderChange(event) {
    this.setState({ orderId: event.target.value });
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
    this.setState({ isModalShowing: false, status: '' });
  }

  /**
   * Navigate to another page
   */
  navigate(to) {
    this.props.history.push(to);
  }
}

// styled:

const StatusMessage = styled.div`
  font-size: 20px;
  color: #000;
`;

// redux:

const mapStateToProps = state => {
  const { uid, user_type, first_name, last_name } = state;

  return {
    uid,
    user_type,
    first_name,
    last_name
  };
};

export default connect(mapStateToProps)(Status);