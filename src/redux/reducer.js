import { LOGIN_CUSTOMER, LOGIN_SALES_REP, LOGOUT } from './types';

const INITIAL_STATE = {
    user_type: '',
    uid: ''
}

const Reducer = function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN_CUSTOMER:
            return { ...state, user_type: 'customer', uid: '77eaf7e0-d275-4a66-9386-441ad07c343e' }
        case LOGIN_SALES_REP:
            return { ...state, user_type: 'sales_rep', uid: '77eaf7e0-d275-4a66-9386-441ad07c343e' }
        case LOGOUT:
            return { ...INITIAL_STATE }
        default:
            return state;
    }
};

export default Reducer;