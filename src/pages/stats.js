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
      orders: []
    }

    state = this.INITIAL_STATE

    componentWillMount () {
      if (this.props.user_type !== user_types.SALES_MANAGER) {
        this.props.history.push('/login')
      }
      api.getAllOrders()
        .then(res1 => { this.setState({ orders: JSON.parse(res1) }); return api.getOrderStats()})
        .then(res2 => console.warn(JSON.parse(res2)));
    }

    render () {
        if (this.state.loading) return <div></div>
        return (
            <PageContainer>
                <Header navigate={this.navigate.bind(this)} logout={this.handleLogout.bind(this)} user_type={this.props.user_type} />
                <FormContainer>
                    <FormHeader>Order Statistics</FormHeader>
                    <StatsContainer><Stat>Most: <strong>ID</strong></Stat></StatsContainer>
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
        this.props.history.push('/login');
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
    }
}

const mapStateToProps = state => {
    const { uid, user_type } = state;

    return {
        uid,
        user_type
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);