import {
  getAuthUser,
  testAuth,
  exchangeAuthTokens,
} from "../services/api.service";
import { authenticateSockets } from "../services/websocket.service";
import setAuthToken from "../utils/setAuthToken";
import {
  USER_LOADED,
  WALLET_CHANGE,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RELOADING_USER,
  SELECT_CURRENCY,
  UPDATE_CURRENCY,
  UPDATE_FIAT,
  DISPLAY_FIAT,
  TOGGLE_SIDEBAR,
} from "./types";

// Load user from API
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const response = await getAuthUser();
    authenticateSockets(response.token);

    dispatch({
      type: USER_LOADED,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Reload User, don't authenticate sockets
export const reloadUser = () => async dispatch => {
  dispatch({
    type: RELOADING_USER,
  });

  try {
    const response = await getAuthUser();
    dispatch({
      type: USER_LOADED,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};


export const changeWallet = ({ amount, currency }) => dispatch => {
  dispatch({
    type: WALLET_CHANGE,
    payload: { amount, currency },
  });
};


// Select currency action
export const selectCurrency = (fiatCurrency) => async dispatch => {
  console.log("Dispatching SELECT_CURRENCY with payload:", { fiatCurrency }); // Log the payload

  dispatch({
    type: SELECT_CURRENCY,
      payload: { fiatCurrency },
  });
};
// actions/AUTH.js

export const updateCurrency = (currency, logo) => async dispatch => {
  console.log("Dispatching updateCurrency with payload:", { currency, logo }); // Log the payload

  dispatch({
    type: UPDATE_CURRENCY,
    payload: { currency, logo },
  });
};



export const updateFiat = (fiatCurrency) => async dispatch => {
  console.log("Dispatching UpdateFiat with payload:", { fiatCurrency }); // Log the payload

  dispatch({
    type: UPDATE_FIAT,
    payload: { fiatCurrency },
  });
};
export const DisplayFiat = (Display) => async dispatch => {
  console.log("Dispatching UpdateFiat with payload:", { Display }); // Log the payload

  dispatch({
    type: DISPLAY_FIAT,
    payload: { Display },
  });
};

// Exchange identifier token to auth token
export const exchangeTokens = ({ idToken }) => async dispatch => {
  try {
    const response = await exchangeAuthTokens(idToken);
    dispatch(login({ token: response.token }));
  } catch (error) {
    // Handle error if needed
  }
};

// Login User
export const login = ({ token }) => async dispatch => {
  setAuthToken(token);
  try {
    const response = await testAuth();
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: response.data, token },
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout user
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
