import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const GoogleLoginButton = ({ onLogin }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("No credential received from Google!");
      return;
    }
    try {
      if (loginWithGoogle) {
        const success = await loginWithGoogle(credentialResponse.credential);
        if (success) {
          onLogin && onLogin(success); // Pass received data to parent if needed
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google Login Failed")}
        useOneTap
        shape="rectangular"
        size="large"
        text="signin_with"
      />
    </div>
  );
};

export default GoogleLoginButton;
