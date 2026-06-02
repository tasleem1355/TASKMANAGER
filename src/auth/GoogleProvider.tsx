import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function GoogleProvider({ children }: Props) {
  return (
    <GoogleOAuthProvider clientId="159902044212-voj7h7quf7fo6pqjqal1d8hdpjqk94f2.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
