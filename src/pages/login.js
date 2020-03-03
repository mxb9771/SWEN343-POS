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
        email: '',
        password: ''
    }

    render () {
        return (
            <PageContainer>
                <FormContainer>
                    <Header>Login</Header>
                    <FormItem>
                        <Label>Email</Label>
                        <Input onChange={this.handleEmailChange} value={this.state.email} />
                    </FormItem>
                    <FormItem>
                        <Label>Password</Label>
                        <Input type="password" onChange={this.handlePasswordChange} value={this.state.password} />
                    </FormItem>
                    <Button onClick={this.handleClick}>Login</Button>
                </FormContainer>
            </PageContainer>
        );
    }

    handleEmailChange = event => {
        this.setState({ email: event.target.value})
    }

    handlePasswordChange = event => {
        this.setState({ password: event.target.value})
    }

    handleClick = () => {
        const { email, password } = this.state;

        // do auth check here

        if (email.includes('salesrep')) {
            this.props.loginSalesRep()

        } else {
            this.props.loginCustomer()
        }

        this.props.history.push('/sale')
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
    width: 350px;
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
    margin-bottom: 15px;
`;

const Input = styled.input`
    height: 30px;
    width: calc(100% - 10px);
    margin-bottom: 15px;
    padding-left: 10px;
    font-size: 13px;
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
        loginSalesRep: () => dispatch({ type: types.LOGIN_SALES_REP }),
        loginCustomer: () => dispatch({ type: types.LOGIN_CUSTOMER })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);