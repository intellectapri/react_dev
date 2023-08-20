import { SET_ACTIVE_PAGE_TITLE } from "../constants";
import config from "./../config";

export function setActivePageTitle(title) {
  return (dispatch) => {
    document.title = title + ` - ` + config.title;
    dispatch({ type: SET_ACTIVE_PAGE_TITLE, title });
  };
}
