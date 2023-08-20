import {
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAILURE,
  LOAD_PRODUCT_TOUR_PRICING_SUCCESS,
  LOAD_PRODUCT_TOUR_PRICING_FAILURE,
} from "../constants";

import { getProducts, getProductTourPricing } from "../middleware/api/products";

export function requestProducts() {
  return (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS_REQUEST });
    return getProducts()
      .then((data) => {
        dispatch({
          type: LOAD_PRODUCTS_SUCCESS,
          data,
        });
      })
      .catch(() => {
        dispatch({ type: LOAD_PRODUCTS_FAILURE });
      });
  };
}

export function requestProductTourPricing(customerId, productId) {
  return (dispatch) => {
    return getProductTourPricing(customerId, productId)
      .then((data) => {
        dispatch({
          type: LOAD_PRODUCT_TOUR_PRICING_SUCCESS,
          data,
        });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: LOAD_PRODUCT_TOUR_PRICING_FAILURE });
      });
  };
}
