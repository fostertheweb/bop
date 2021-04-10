import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { useLogin, useRedirectTo } from "hooks/use-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";

export default function Login() {
  const location = useLocation();
  const { code } = parse(location.search);
  const [login, { status }] = useLogin();
  const redirect_uri = `${window.location.origin}${window.location.pathname}`;
  const navigate = useNavigate();
  const [isRedirecting, setRedirecting] = useState(false);
  const redirectTo = useRedirectTo();

  useEffect(() => {
    if (code && status === "idle") {
      login({ code, redirect_uri });
    }

    if (status === "success") {
      setRedirecting(true);
    }
    // eslint-disable-next-line
  }, [code, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRedirecting) {
        navigate(redirectTo);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isRedirecting]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-center text-gray-600">
      <FontAwesomeIcon
        icon={faSpinnerThird}
        size="3x"
        className="text-gray-500 fill-current"
        spin
      />
      <div className="h-4"></div>
      <div>Logged into Spotify. Redirecting to CrowdQ.</div>
    </div>
  );
}
