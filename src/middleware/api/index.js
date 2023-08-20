export const CALL_API = Symbol("Call API");

export default (store) => (next) => (action) => {
  const callAPI = action[CALL_API];

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === "undefined") {
    // Reset type action
    if (action.type) return next(action);
    return next(action);
  }

  const { types, authenticated, method, data, filters } = callAPI;
  let endpoint = callAPI.endpoint;

  if (typeof endpoint === "function") {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== "string") {
    throw new Error("Specify a string endpoint URL.");
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected an array of three action types.");
  }

  if (!types.every((type) => typeof type === "string")) {
    throw new Error("Expected action types to be strings.");
  }

  const [successType, errorType] = types;

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  return callApi(endpoint, authenticated, method, data).then(
    (response) =>
      next({
        response,
        authenticated,
        filters: filters,
        type: successType,
      }),
    (error) =>
      next({
        error: error,
        type: errorType,
      }),
  );
};
