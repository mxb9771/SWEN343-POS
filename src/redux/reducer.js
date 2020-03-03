import { LOGIN_CUSTOMER, LOGIN_SALES_REP } from './types';

const INITIAL_STATE = {
    user_type: '',
    uid: null
}

const Reducer = function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN_CUSTOMER:
            return { ...state, user_type: 'customer', uid: 2 }
        case LOGIN_SALES_REP:
            return { ...state, user_type: 'sales_rep', uid: 1 }
        default:
            return state;
    }
};

export default Reducer;