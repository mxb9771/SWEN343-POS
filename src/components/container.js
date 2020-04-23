// external imports:

import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import { connect } from 'react-redux';

// local imports:

import * as api from '../api';
import * as types from '../redux/action_types';
import { CUSTOMER } from '../redux/user_types';
import { PageContainer } from '../pages/styled';
import Header from './header';

/**
 * Page container component which handles:
 * 
 * (1) Authentication
 * (2) Header navigation
 * (3) Loading indicators
 * 
 * @component
 */
class Container extends Component {
  componentWillMount () {
    api.handleAuthentication(window.location.search, this.props.login, this.props.user_type);
  }

  render () {
    const { user_type, page, first_name, last_name, isLoading, navigate } = this.props;

    return (
      <PageContainer>
        { isLoading &&  (
          <CenterLoadingIndicator>
            <ReactLoading type='bubbles' color='white' height={200} width={100} />
          </CenterLoadingIndicator>
        )}
        <Header
          page={page}
          user={`${first_name} ${last_name} (${user_type})`}
          isAuthenticated={user_type !== CUSTOMER}
          navigate={navigate} 
          logout={this.handleLogout.bind(this)} 
          user_type={user_type}
        /> 
        {this.props.children}
      </PageContainer>
    );
  }

  /**
   * logout and refresh the screen
   */
  handleLogout () {
    this.props.logout();
    window.location.reload(false);
  }
}

// styled components:

const CenterLoadingIndicator = styled.div`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// redux:

const mapStateToProps = state => {
  const { uid, user_type, manager_id, first_name, last_name } = state;

  return {
      user_type,
      first_name,
      last_name
  };
};

const mapDispatchToProps = dispatch => {
  return {
      login: payload => dispatch({ type: types.LOGIN, payload }),
      logout: () => dispatch({ type: types.LOGOUT })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);

