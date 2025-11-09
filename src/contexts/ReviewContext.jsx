import { createContext, useContext, useReducer } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { getUserProfile } from "../api/user"; // ✅ fetch customer_id
import { API_URL } from "../api/api";

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

  // Fetch reviews for a product
  const fetchReviews = async (productId) => {
    if (!productId) return [];
    try {
      dispatch({ type: "FETCH_START" });
      const res = await axios.get(`${API_URL}/reviews/`, {
        params: { product: productId },
        headers: user ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: !!user,
      });
      const data = res.data.results || res.data;
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      return data;
    } catch (err) {
      console.error("Error fetching reviews:", err);
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
    formData.append("title", review.title);
    formData.append("customer", review.customer);
    formData.append("rating", review.rating);
    formData.append("review", review.comment);
    formData.append("product", productId); // ✅ Add this line

    // Append media files if any
    if (review.media?.length > 0) {
      review.media.forEach((m) => formData.append("media", m.file));
    }

    const res = await axios.post(`${API_URL}/reviews/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    dispatch({ type: "ADD_REVIEW", payload: res.data });
    return res.data;
  } catch (err) {
    console.error("Error posting review:", err.response?.data || err.message);
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
