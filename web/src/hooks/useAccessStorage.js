import React, { createContext, useContext, useState, useEffect } from "react";
import { stringify as stringifyQueryString } from "query-string";

const TokensContext = createContext();

export function TokensProvider({ children }) {
  const tokens = useTokensProvider();

  return <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>;
}

export const useAccessStorage = () => {
  return useContext(TokensContext);
};

function useTokensProvider(component) {
  const [tokens, setTokens] = useState({});
  const [error, setError] = useState(null);

  function getTokensFromStorage() {
    try {
      const tokens = JSON.parse(localStorage.getItem("bop:spotify:access"));
      setTokens(tokens);
    } catch (err) {
      setError(err);
    }
  }

  function storeTokens(credentials) {
    console.log(credentials);
    localStorage.setItem("bop:spotify:access", JSON.stringify(credentials));
    setTokens(credentials);
  }

  async function refresh() {
    try {
      const response = await fetch(
        `http://localhost:4000/refresh?${stringifyQueryString({
          refresh_token: tokens.refresh_token,
        })}`,
      );
      const { access_token } = await response.json();
      setTokens({ ...tokens, access_token });
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    getTokensFromStorage();
    //eslint-disable-next-line
  }, []);

  return { tokens, error, storeTokens, refresh, getTokensFromStorage };
}
