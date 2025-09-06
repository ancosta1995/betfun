// reducers/auth.js
import {
  USER_LOADED,
  RELOADING_USER,
  WALLET_CHANGE,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SELECT_CURRENCY,
  LOGOUT,
  UPDATE_CURRENCY,
  UPDATE_FIAT,
  DISPLAY_FIAT,
  TOGGLE_SIDEBAR,
} from "../actions/types";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import usdIcon from '../assets/coin/usd.svg';

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  user: null,
  volume: 1,
  hidden: false, // Sidebar state, initially closed
  siteSounds: true,
  gameSounds: true,
  natureSounds: true,
  chatEnabled: true,
  DisplayForFiat: JSON.parse(localStorage.getItem('DisplayForFiat')) || false,
  selectedFiatCurrency: localStorage.getItem('selectedFiatCurrency') || 'USD', // Load from localStorage or default to 'USD'
  selectedCurrency: localStorage.getItem('selectedCurrency') || 'USD',
  selectedLogo: localStorage.getItem('selectedLogo') ? 
    (localStorage.getItem('selectedLogo').startsWith('http') ? usdIcon : localStorage.getItem('selectedLogo')) 
    : usdIcon,
  DisplayFiat: 'USD',
  DisplayForFiat: 'USD'
};

export const auth = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: payload.user,
      };
    case RELOADING_USER:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
      };
    case WALLET_CHANGE:
      const { amount, currency } = payload;
      const newBalance = state.user.wallet[currency].balance + amount;
      return {
        ...state,
        user: {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            [currency]: {
              ...state.user.wallet[currency],
              balance: Math.max(newBalance, 0),
            },
          },
          wager: amount < 0 ? state.user.wager + Math.abs(amount) : state.user.wager,
        },
      };
    case UPDATE_CURRENCY:
      localStorage.setItem('selectedCurrency', payload.currency);
      localStorage.setItem('selectedLogo', payload.logo);
      return {
        ...state,
        selectedCurrency: payload.currency,
        selectedLogo: payload.logo,
      };
      case TOGGLE_SIDEBAR:
        const { hidden } = payload;

        return {
          ...state,
          hidden: payload.hidden, // Toggle the sidebar
        };
  
    case UPDATE_FIAT:
      localStorage.setItem('selectedFiatCurrency', payload.fiatCurrency);
      return {
        ...state,
        selectedFiatCurrency: payload.fiatCurrency,
      };
    case DISPLAY_FIAT:
      localStorage.setItem('DisplayForFiat', JSON.stringify(payload.Display));
      return {
        ...state,
        DisplayForFiat: payload.Display,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        isLoading: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default auth;
