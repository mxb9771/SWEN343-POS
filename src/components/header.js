// external imports:

import * as api from '../api'
import React, { Component } from 'react';
import styled from 'styled-components';

// internal imports:

import { CUSTOMER, SALES_MANAGER, SALES_REP, CEO } from '../redux/user_types';

/**
 * Header component with links and authentication information
 * 
 * @component
 */
const Header = ({ user_type, logout, navigate, isAuthenticated, page, user }) => {
  const redirect_url = `${window.location.protocol}//${window.location.host}`;

  return (
    <Container>
      <LeftPosition>
        <Link onClick={() => navigate('/sale')}>Sale</Link>
        <Link onClick={() => navigate('/refund')}>Refund</Link>
        <Link onClick={() => navigate('/status')}>Status</Link>
        { (user_type === SALES_MANAGER || user_type === CEO) && <Link onClick={() => navigate('/stats')}>Stats</Link>}
      </LeftPosition>
      <RightPosition>
        { (user && user_type !== CUSTOMER) && <User>{user}</User>}
        { isAuthenticated &&  <LogoutButton onClick={logout}>Logout</LogoutButton> }
        { !isAuthenticated &&  (
          <LoginButton
            href={api.hr_login_url+encodeURIComponent(redirect_url+page+'?token=')}
          >
            Login
          </LoginButton> 
        )}
      </RightPosition>
    </Container>
  );
};

// styled components:

const Container = styled.div`
  display: flex;
  width: 95%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  @media (max-width: 860px) {
    justify-content: space-around;
    flex-direction: column;
    height: 150px;
  }
`;

const RightPosition = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const LeftPosition = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Link = styled.div`
  font-size: 15px;
  color: #555555;
  width: 100px;
  height: 30px;
  text-align: center;
  cursor: pointer;
  &:hover {
      color: black;
      border-color: black;
  }
  line-height: 30px;
`;

const User = styled.div`
  font-size: 15px;
  color: #555555;
  text-align: center;
  margin: 25px 30px;
  height: 30px;
  align-self: flex-start;
  line-height: 30px;
`;

const LoginButton = styled.a`
    font-size: 15px;
    color: rgba(0,0,0,0.7);
    width: 100px;
    text-align: center;
    cursor: pointer;
    &:hover {
        color: black;
        border-color: black;
    }
    border: 2px solid rgba(0,0,0,0.7);;
    line-height: 30px;
    text-decoration: none;
`;

const LogoutButton = styled.div`
    font-size: 15px;
    color: rgba(192, 57, 43, 0.8);
    width: 100px;
    text-align: center;
    cursor: pointer;
    &:hover {
        color: rgba(192, 57, 43, 1.0);
        border-color: rgba(192, 57, 43, 1.0);
    }
    margin: 25px 0;
    height: 30px;
    align-self: flex-start;
    border: 2px solid rgba(192, 57, 43, 0.8);
    line-height: 30px;
`;

export default Header;

