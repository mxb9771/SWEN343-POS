// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';

// internal imports:

import { CUSTOMER, SALES_MANAGER, SALES_REP } from '../redux/user_types';

const Header = ({ user_type, logout, navigate }) => {
  return (
    <Container>
      <Link onClick={() => navigate('/sale')}>Sale</Link>
      <Link onClick={() => navigate('/refund')}>Refund</Link>
      <Link onClick={() => navigate('/status')}>Status</Link>
      { user_type === SALES_MANAGER && <Link onClick={() => navigate('/stats')}>Stats</Link>}
      <RightPosition>
        <AuthLink onClick={logout}>{ user_type !== CUSTOMER ? 'Logout' : 'Login'}</AuthLink>
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

const AuthLink = styled.div`
    font-size: 15px;
    color: #555555;
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
    border: 2px solid #555555;
    line-height: 30px;
`;

export default Header;

