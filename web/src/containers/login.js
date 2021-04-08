import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { useLogin } from "hooks/use-login";
import { LoginButton } from "components/spotify/login-button";

export default function Login() {
  const location = useLocation();
  const { code } = parse(location.search);
  const [login, { status }] = useLogin();
  const redirect_uri = `${window.location.origin}${window.location.pathname}`;

  useEffect(() => {
    if (code && status === "idle") {
      login({ code, redirect_uri });
    }
    // eslint-disable-next-line
  }, [code, status]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <LoginButton loading={status === "loading"} redirect={redirect_uri} />
    </div>
  );
}
