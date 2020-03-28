export default function() {
  const getAccessKeys = () => {
    try {
      return localStorage.getItem("bop:spotify:access");
    } catch (err) {
      return null;
    }
  };

  const setAccessKeys = keys => {
    localStorage.setItem("bop:spotify:access", JSON.stringify(keys));
  };

  const updateAccessToken = access_token => {
    const access = getAccessKeys();
    if (access) {
      const { code, refresh_token } = access;
      setAccessKeys({ code, refresh_token, access_token });
    }
  };

  return { getAccessKeys, setAccessKeys, updateAccessToken };
}
