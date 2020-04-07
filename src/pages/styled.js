import style from '../style';
import styled from 'styled-components';

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-family: ${style.font_family};
`;


const FormHeader = styled.h1`
    color: black;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const FormContainer = styled.div`
    width: 80%;
    padding: 0 30px 30px 30px;
    background-color: white;
    margin-bottom: 4%;
    -webkit-box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
    -moz-box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 14px -1px rgba(0,0,0,0.1);
`;

const SubmitButton = styled.div`
    background-color: #16a085;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: white;
    cursor: ${props => props.disabled ? '' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1.0};
    font-size: 18px;
    &:hover {
        background-color: ${props => props.disabled ? '#16a085' : '#168871'};
    }
    margin-top: 30px;
`

const CustomerEntry = styled.div`
  margin-bottom: 10px;
`;

const NameInput = styled.input`
    height: 30px;
    width: 200px;
    padding-left: 10px;
    font-size: 13px;
`;

const Label = styled.div`
    margin-bottom: 15px;
`;

export {
  PageContainer,
  FormHeader,
  FormContainer,
  SubmitButton,
  CustomerEntry,
  NameInput,
  Label
}