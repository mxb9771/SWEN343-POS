import { LOGIN, LOGOUT } from './action_types';
import { CUSTOMER, SALES_MANAGER, SALES_REP } from './user_types';
import Cookie from "js-cookie";

const INITIAL_STATE = {
    user_type: CUSTOMER,
    uid: '',
    first_name: '',
    last_name: '',
    role: '',
    manager_id: ''
};

const Reducer = function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN:
            Cookie.set("token", action.payload.token);
            return {
                ...state, 
                user_type: action.payload.RoleName, 
                uid: action.payload.EmployeeId, 
                first_name: action.payload.EmployeeFirstName,
                last_name: action.payload.EmployeeLastName,
                manager_id: action.payload.ManagerId
            };
        case LOGOUT:
            Cookie.remove("token")
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};

export default Reducer;