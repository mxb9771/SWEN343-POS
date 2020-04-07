import { LOGIN_CUSTOMER, LOGIN_SALES_REP, LOGIN_SALES_MANAGER, LOGOUT } from './action_types';
import { CUSTOMER, SALES_MANAGER, SALES_REP } from './user_types';

const INITIAL_STATE = {
    user_type: CUSTOMER,
    uid: ''
}

const Reducer = function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN_CUSTOMER:
            return { ...state, user_type: CUSTOMER, uid: '77eaf7e0-d275-4a66-9386-441ad07c343e' }
        case LOGIN_SALES_REP:
            return { ...state, user_type: SALES_REP, uid: '77eaf7e0-d275-4a66-9386-441ad07c343e' }
        case LOGIN_SALES_MANAGER:
            return { ...state, user_type: SALES_MANAGER, uid: '77eaf7e0-d275-4a66-9386-441ad07c343e' }
        case LOGOUT:
            return { ...INITIAL_STATE }
        default:
            return state;
    }
};

export default Reducer;