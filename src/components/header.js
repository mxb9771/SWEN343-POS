// external imports:
import * as api from '../api'
import React, { Component } from 'react';
import styled from 'styled-components';
// internal imports:

import { CUSTOMER, SALES_MANAGER, SALES_REP } from '../redux/user_types';

const Header = ({ user_type, logout, navigate, isAuthenticated, page, user }) => {
  const redirect_url = `${window.location.protocol}//${window.location.host}`

  return (
    <Container>
      <Link onClick={() => navigate('/sale')}>Sale</Link>
      <Link onClick={() => navigate('/refund')}>Refund</Link>
      <Link onClick={() => navigate('/status')}>Status</Link>
      { (user_type === SALES_MANAGER || user_type === 'CEO') && <Link onClick={() => navigate('/stats')}>Stats</Link>}
      <RightPosition>
        { (user && user_type !== CUSTOMER) && <User>{user}</User>}
        { isAuthenticated &&  <AuthLink onClick={logout}>Logout</AuthLink> }
        { !isAuthenticated &&  (
          <AuthLinkA 
            href={api.hr_login_url+encodeURIComponent(redirect_url+page+'?token=')}
          >
            Login
          </AuthLinkA> 
        )}
      </RightPosition>
    </Container>
  );
};


// styled components:

const Container = styled.div`
  display: flex;
  width: 80%;
  position: relative;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100px;
`;

const RightPosition = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Link = styled.div`
  font-size: 15px;
  color: #555555;
  width: 100px;
  text-align: center;
  cursor: pointer;
  &:hover {
      color: black;
      border-color: black;
  }
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

const AuthLinkA = styled.a`
    font-size: 15px;
    color: rgba(0,0,0,0.7);
    width: 100px;
    text-align: center;
    cursor: pointer;
    &:hover {
        color: black;
        border-color: black;
    }
    margin: 25px 0;
    height: 30px;
    align-self: flex-start;
    border: 2px solid rgba(0,0,0,0.7);;
    line-height: 30px;
    text-decoration: none;
`;

const AuthLink = styled.div`
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

