import { SET_ACTIVE_PAGE_TITLE } from "../constants";

export function settingsReducer(
  state = {
    activePageTitle: `Bonza bike tours`,
  },
  action,
) {
  switch (action.type) {
    case SET_ACTIVE_PAGE_TITLE:
      return Object.assign({}, state, {
        activePageTitle: action.title,
      });
    default:
      return state;
  }
}
