import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";

import { useLogin } from "hooks/use-login";
import { LoginButton } from "components/login-button";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code } = parse(location.search);
  const { login, status } = useLogin();
  const redirect_uri = `${window.location.origin}${window.location.pathname}`;

  useEffect(() => {
    if (code && status === "idle") {
      login(code, redirect_uri);
    }

    if (status === "success") {
      navigate("/host");
    }
    // eslint-disable-next-line
  }, [code, status]);

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <LoginButton loading={status === "pending"} redirect_uri={redirect_uri} />
    </div>
  );
}
