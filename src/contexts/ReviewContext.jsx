import { createContext, useContext, useReducer } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_URL } from "../api/api";

/* eslint-disable react-refresh/only-export-components */
const ReviewContext = createContext();

const initialState = {
  reviews: [],
  loading: false,
  initialized: false,
  error: null,
};

function reviewReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null, initialized: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, reviews: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_REVIEW":
      return { ...state, reviews: [...state.reviews, action.payload] };
    default:
      return state;
  }
}

export const ReviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);
  const { user } = useAuth();
  const token = localStorage.getItem("access");

  // Fetch reviews for a specific product
  const fetchReviews = async (productId) => {
    try {
      dispatch({ type: "FETCH_START" });
      const res = await axios.get(`${API_URL}/demo/review`, {
        params: { productId },
        headers: user ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: !!user,
      });
      dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      return [];
    }
  };

  // Post a new review
  const postReview = async (productId, review) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", review.name);
      formData.append("rating", review.rating);
      formData.append("comment", review.comment);
      review.media?.forEach((fileObj) => {
        formData.append("media", fileObj.file);
      });
      formData.append("productId", productId);

      const res = await axios.post(`${API_URL}/demo/review`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch({ type: "ADD_REVIEW", payload: res.data });
      return res.data;
    } catch (err) {
      console.error("Error posting review:", err);
      throw err;
    }
  };

  return (
    <ReviewContext.Provider value={{ ...state, fetchReviews, postReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => useContext(ReviewContext);
