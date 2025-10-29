import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const AddressContext = createContext();

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, addresses: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_ADDRESS":
      return { ...state, addresses: [action.payload, ...state.addresses] };
    case "UPDATE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case "DELETE_ADDRESS":
      return { ...state, addresses: state.addresses.filter((a) => a.id !== action.payload) };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export const AddressProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  const fetchAddresses = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/auth/addresses/");
      const data = res.data;
      const list = Array.isArray(data) ? data : data.results || [];
      dispatch({ type: "FETCH_SUCCESS", payload: list });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err?.response?.data || err.message || "Failed to load addresses" });
    }
  };

  const addAddress = async (address) => {
    const res = await api.post("/api/auth/addresses/", address);
    dispatch({ type: "ADD_ADDRESS", payload: res.data });
    return res.data;
  };

  const updateAddress = async (id, patch) => {
    const res = await api.patch(`/api/auth/addresses/${id}/`, patch);
    dispatch({ type: "UPDATE_ADDRESS", payload: res.data });
    return res.data;
  };

  const deleteAddress = async (id) => {
    await api.delete(`/api/auth/addresses/${id}/`);
    dispatch({ type: "DELETE_ADDRESS", payload: id });
  };

  useEffect(() => {
    if (user) fetchAddresses();
    else dispatch({ type: "CLEAR" });
  }, [user]);

  return (
    <AddressContext.Provider value={{ ...state, fetchAddresses, addAddress, updateAddress, deleteAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => useContext(AddressContext);
export default AddressContext;
