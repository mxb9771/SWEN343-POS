// external imports:

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import style from '../style';


// local imports:

import * as types from '../redux/types';


// component:

class Login extends Component {
    state = {
        username: '',
        password: ''
    }

    render () {
        return (
            <PageContainer>
                <FormContainer>
                    <Header>Login</Header>
                    <FormItem>
                        <Label>Username</Label>
                        <Input />
                    </FormItem>
                    <FormItem>
                        <Label>Password</Label>
                        <Input />
                    </FormItem>
                    <Button>Login</Button>
                </FormContainer>
            </PageContainer>
        );
    }
}

// styled components: 

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-family: ${style.font_family};
    max-width: 1000px;
`;

const FormContainer = styled.div`
    width: 80%;
    padding: 0 30px 30px 30px;
    background-color: white;
    margin-top: 4%;
    -webkit-box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
    -moz-box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
`;

const Header = styled.h1`
    color: black;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const FormItem = styled.div`

`;

const Label = styled.div`

`;

const Input = styled.input`
    height: 30px;
    width: 70px;
    padding-left: 10px;
`;

const Button = styled.div`
    background-color: #16a085;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    &:hover {
        background-color: #168871;
    }
    margin-top: 30px;
`;

// redux:

const mapStateToProps = state => {
    const { uid, user_type } = state;

    return {
        uid,
        user_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginSuccess
    }
}

const loginSuccess = dispatch => {
    dispatch({ type: types.LOGIN_SUCCESS })
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);