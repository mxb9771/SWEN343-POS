import { LOGIN_CUSTOMER, LOGIN_SALES_REP, LOGIN_SALES_MANAGER, LOGOUT } from './action_types';
import { CUSTOMER, SALES_MANAGER, SALES_REP } from './user_types';

const INITIAL_STATE = {
    user_type: CUSTOMER,
    uid: ''
}

const Reducer = function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN_CUSTOMER:
            return { ...state, user_type: CUSTOMER, uid: '' }
        case LOGIN_SALES_REP:
            return { ...state, user_type: SALES_REP, uid: 'd290f1ee-6c54-4b01-90e6-d701748f08aa' }
        case LOGIN_SALES_MANAGER:
            return { ...state, user_type: SALES_MANAGER, uid: 'd290f1ee-6c54-4b01-90e6-d701748f08aa' }
        case LOGOUT:
            return { ...INITIAL_STATE }
        default:
            return state;
    }
};

export default Reducer;