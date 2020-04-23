// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import * as types from '../redux/action_types';
import * as user_types from '../redux/user_types';
import * as api from '../api';
import { Container } from '../components';
import {
  FormHeader,
  FormContainer,
  Table,
  TableBody,
  TableRow,
  HeaderRow,
  TableHeader,
  TableData
} from './styled';

/**
 * Page for checking order log and overall statistics
 * 
 * @component
 */
class Stats extends Component {
  INITIAL_STATE = {
    isLoading: true,
    orders: [],
    stats: {}
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentWillMount() {
    if (this.props.user_type !== user_types.SALES_MANAGER) {
      this.handleLogout();
    }

    api.getAllOrders()
      .then(res => {
        this.setState({ orders: JSON.parse(res) });
        return api.getOrderStats();
      })
      .then(res => this.setState({ stats: JSON.parse(res), isLoading: false }));
  }

  render() {
    return (
      <Container
        user_type={this.props.user_type}
        page="/stats"
        isLoading={this.state.isLoading}
        navigate={this.navigate.bind(this)}
      >
        <FormContainer>
          <FormHeader>Order Statistics</FormHeader>
          <StatsContainer>
            <Stat>Sale Count: <strong>{this.state.stats.sale_count}</strong></Stat>
            <Stat>Gross Profits: <strong>${this.state.stats.gross_profits}</strong></Stat>
            <Stat>Net Profits: <strong>${this.state.stats.net_profits}</strong></Stat>
          </StatsContainer>
        </FormContainer>
        <FormContainer>
          <FormHeader>Order Log</FormHeader>
          <Table>
            <HeaderRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Customer ID</TableHeader>
              <TableHeader>Sales Person ID</TableHeader>
              <TableHeader>Total Price</TableHeader>
              <TableHeader>Net Profit</TableHeader>
              <TableHeader>Status</TableHeader>
            </HeaderRow>
            <TableBody>
              {this.state.orders.map(o =>
                <this.Order
                  id={o.id}
                  customerId={o.customerId}
                  salesPersonId={o.salesPersonId}
                  totalPrice={o.totalPrice}
                  netProfit={o.netProfit}
                  orderStatus={o.orderStatus}
                />
              )
              }
            </TableBody>
          </Table>
        </FormContainer>
      </Container>
    );
  }

  /**
     * Component for a single order row in the log table
     * 
     * @param {string} id - product id
     * @param {string} customerId
     * @param {number} salesPersonId - sales rep id
     * @param {number} totalPrice - number of items being ordered
     * @param {number} netProfit - how many are in stock
     * @param {string} orderStatus - status of this order
     * @component 
     * @return {JSX}
     */
  Order = ({ id, customerId, salesPersonId, totalPrice, netProfit, orderStatus }) => {
    return (
      <>
        <TableRow>
          <TableData width={50}>{id}</TableData>
          <TableData width={50}>{customerId}</TableData>
          <TableData width={50}>{salesPersonId}</TableData>
          <TableData width={50}>{totalPrice}</TableData>
          <TableData width={50}>{netProfit}</TableData>
          <TableData width={50}>{orderStatus}</TableData>
        </TableRow>
      </>
    );
  };

  // helpers:

  /**
   * Special case for logout since this page is only accessible to
   * authenticated managers
   */
  handleLogout() {
    this.setState(this.INITIAL_STATE);
    this.props.logout();
    this.props.history.push('/sale');
  }

  /**
   * Navigate to another page
   */
  navigate(to) {
    this.props.history.push(to);
  }
}

// styled:

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Stat = styled.div`
  font-size: 20px;
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

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch({ type: types.LOGOUT })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);