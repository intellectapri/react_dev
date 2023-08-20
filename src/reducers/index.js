import { combineReducers } from "redux";
import { applicationReducer } from "./application";
import { auth } from "./auth";
import { chargeReducer } from "./charge";
import { checkinReducer } from "./checkin";
import { customerReducer } from "./customer";
import { orderReducer } from "./order";
import { productReducer } from "./product";
import { purchaseReducer } from "./purchase";
import { addPurchaseReducer } from "./addPurchase";
import { userReducer } from "./user";
import { settingsReducer } from "./settings";

const reducers = combineReducers({
  applicationReducer,
  auth,
  chargeReducer,
  checkinReducer,
  customerReducer,
  orderReducer,
  productReducer,
  purchaseReducer,
  addPurchaseReducer,
  userReducer,
  settingsReducer,
});

export default reducers;
