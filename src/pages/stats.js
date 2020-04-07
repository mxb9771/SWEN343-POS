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
  FormContainer
} from './styled';

// component

class Stats extends Component {
    INITIAL_STATE = {
      
    }

    state = this.INITIAL_STATE

    componentWillMount () {
      if (this.props.user_type !== user_types.SALES_MANAGER) {
        this.props.history.push('/login')
      }
    }

    render () {
        return (
            <PageContainer>
                <Header navigate={this.navigate.bind(this)} logout={this.handleLogout.bind(this)} user_type={this.props.user_type} />
                <FormContainer>
                    <FormHeader>Order Statistics</FormHeader>
                    
                </FormContainer>
            </PageContainer>
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