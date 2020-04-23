// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import * as api from '../api';
import { Modal, Container } from '../components';
import {
  FormHeader,
  FormContainer,
  SubmitButton,
  CustomerEntry,
  NameInput,
  Label
} from './styled';

/**
 * Page for making refund of an order
 * 
 * @component
 */
class Refund extends Component {
  INITIAL_STATE = {
    orderId: '',
    isModalShowing: false,
    refund: '',
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
        page="/refund"
        isLoading={this.state.isLoading}
        navigate={this.navigate.bind(this)}
      >
        {this.state.isModalShowing && (
          <Modal close={this.hideModal.bind(this)}>
            <RefundMessage>
              Refund: <strong>{this.state.refund}</strong>
            </RefundMessage>
          </Modal>
        )
        }
        <FormContainer>
          <FormHeader>Make a Refund</FormHeader>
          <CustomerEntry>
            <Label>Order ID</Label>
            <NameInput value={this.state.orderId} onChange={this.handleOrderChange.bind(this)} />
          </CustomerEntry>
          <SubmitButton
            disabled={this.state.orderId === ''}
            onClick={this.state.orderId !== '' ? this.handleRefundButtonClick.bind(this) : null}
          >
            Refund
                    </SubmitButton>
        </FormContainer>
      </Container>
    );
  }

  // helpers:

  /**
   * Event handler for refund button being pressed
   * Modal shows once we get a response
   */
  handleRefundButtonClick() {
    this.setState({ isLoading: true })
    api.makeRefund(this.state.orderId)
      .then(res => this.setState({
        orderId: '', refund: res, isModalShowing: true, isLoading: false
      }))
  }

  /**
   * Input field value change handler
   * 
   * @param {object} - event object for value changed
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
    this.setState({ isModalShowing: false, refund: '' });
  }

  /**
   * Navigate to another page
   */
  navigate(to) {
    this.props.history.push(to);
  }
}

// styled:

const RefundMessage = styled.div`
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

export default connect(mapStateToProps)(Refund);