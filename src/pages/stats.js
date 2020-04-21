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
  Table,
  TableBody,
  TableRow,
  HeaderRow,
  TableHeader,
  TableData
} from './styled';

// component

class Stats extends Component {
    INITIAL_STATE = {
      loading: true,
      orders: [],
      stats: {}
    }

    state = this.INITIAL_STATE

    componentWillMount () {
      api.handleAuthentication(window.location.search, this.props.login, this.props.user_type);  

      if (this.props.user_type !== user_types.SALES_MANAGER) {
        this.handleLogout();
      }
      api.getAllOrders()
        .then(res => {
          this.setState({ orders: JSON.parse(res) });
          return api.getOrderStats()
        })
        .then(res => this.setState({ stats: JSON.parse(res), loading: false }))
    }

    render () {
      if (this.state.loading) return <div style={{ fontSize: 35, marginTop: 10, marginLeft: 10 }}>... Loading</div>
        return (
            <PageContainer>
                <Header 
                  page="/sale"
                  user={`${this.props.first_name} ${this.props.last_name} (${this.props.user_type})`}
                  isAuthenticated={this.props.user_type !== user_types.CUSTOMER}
                  navigate={this.navigate.bind(this)}
                  logout={this.handleLogout.bind(this)}
                  user_type={this.props.user_type}
                />
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
                            {   this.state.orders.map(o => 
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
            </PageContainer>
        );
    }

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
  }

    // helpers

    handleLogout () {
        this.setState(this.INITIAL_STATE)
        this.props.logout();
        this.props.history.push('/sale')
    }

    navigate (to) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Stats);