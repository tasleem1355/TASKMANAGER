import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse: CredentialResponse) => {
        try {
          const token = credentialResponse.credential;
          if (!token) throw new Error("No credential token received");

          await loginWithGoogle(token);
          toast.success("Signed in with Google");
          navigate("/dashboard");
        } catch (err) {
          console.error("Google login error:", err);
          toast.error("Google sign-in failed");
        }
      }}

      onError={() => {
        console.log("Login Failed");
        toast.error("Google sign-in failed");
      }}
    />
  );
}

export default Login;