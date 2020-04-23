// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';

/**
 * Modal component
 * 
 * @component
 */
const Modal = ({ close, children }) => {
  return (
    <Backdrop>
      <Container>
        {children}
        <Close onClick={close}>Close</Close>
      </Container>
    </Backdrop>
  );
};

// styled components:

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const Container = styled.div`
  display: flex;
  background-color: white;
  width: 50%;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 150px;
  padding: 25px;
`;

const Close = styled.div`
  width: 100%;
  font-size: 15px;
  color: #555555;
  text-align: center;
  cursor: pointer;
  &:hover {
      color: black;
      border-color: black;
  }
`;

export default Modal;

