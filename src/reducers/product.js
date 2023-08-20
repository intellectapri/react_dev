import {
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAILURE,
  LOAD_PRODUCT_TOUR_PRICING_SUCCESS,
  LOAD_PRODUCT_TOUR_PRICING_FAILURE,
} from "../constants";

export function productReducer(
  state = {
    products: [],
    tourPricing: false,
  },
  action,
) {
  switch (action.type) {
    case LOAD_PRODUCTS_REQUEST:
      return Object.assign({}, state, {});
    case LOAD_PRODUCTS_SUCCESS:
      return Object.assign({}, state, {
        products: action.data,
      });
    case LOAD_PRODUCTS_FAILURE:
      return Object.assign({}, state, {});
    case LOAD_PRODUCT_TOUR_PRICING_SUCCESS:
      return Object.assign({}, state, {
        tourPricing: action.data,
      });
    case LOAD_PRODUCT_TOUR_PRICING_FAILURE:
      return Object.assign({}, state, {
        tourPricing: false,
      });
    default:
      return state;
  }
}
