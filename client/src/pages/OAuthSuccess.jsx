import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUserFromToken } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!setUserFromToken) {
      console.error("setUserFromToken is not available in AuthContext");
      navigate("/login", { replace: true });
      return;
    }

    const token = searchParams.get("token");

    if (token) {
      // 🔐 Update auth context (this should also handle localStorage)
      setUserFromToken(token);

      // ✅ Redirect to Discover / Home
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [setUserFromToken, navigate, searchParams]);

  return <p className="text-center mt-10">Logging you in...</p>;
};

export default OAuthSuccess;
