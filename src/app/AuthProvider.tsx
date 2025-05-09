import { AuthConfig } from "@/schema/auth";
import { useEffect, useState } from "react";

const AuthProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: AuthConfig;
}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const login = async () => {
    window.location.href = `${config.serverUrl}${config.loginPath}?client_id=${
      config.clientId
    }&redirect_uri=${window.location.origin}&tenantId=${
      config.tenantId
    }&response_type=${config.responseType}&scope=${config.scopes.join(" ")}`;
  };

  const exchangeCodeForToken = async (code: any) => {
    try {
      const response = await fetch(
        `${config.serverUrl}/${config.tokenRefreshPath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: window.location.origin,
            client_id: config.clientId,
            client_secret: config.clientSecret,
          }).toString(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error exchanging code for token: ${response.statusText}`
        );
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("id_token", data.id_token);
      localStorage.setItem(
        "expires_at",
        (Date.now() + data.expires_in * 0.75 * 1000).toString()
      );

      return data;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      login();
      throw error;
    }
  };

  const getAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    try {
      const response = await fetch(
        `${config.serverUrl}/${config.tokenRefreshPath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: config.clientId,
            client_secret: config.clientSecret,
          }).toString(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error refreshing token: ${response.statusText}`);
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("id_token", data.id_token);
      localStorage.setItem(
        "expires_at",
        (Date.now() + data.expires_in * 0.75 * 1000).toString()
      );

      return data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      login();
      throw error;
    }
  };

  const isTokenExpired = () => {
    const expiresAt = localStorage.getItem("expires_at");
    return !expiresAt || Date.now() > parseInt(expiresAt);
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");
      let userAuth = false;

      if (code) {
        try {
          await exchangeCodeForToken(code);
          userAuth = true;
          setAuthenticated(true);
          window.history.replaceState(null, "", "/"); // Clean URL from code parameter
        } catch (error) {
          console.error("Error exchanging code for token:", error);
          setAuthenticated(false);
          userAuth = false;
        }
      } else if (isTokenExpired()) {
        try {
          await getAccessToken();
          setAuthenticated(true);
          userAuth = true;
        } catch (error) {
          console.error("Error refreshing token:", error);
          setAuthenticated(false);
          userAuth = false;
        }
      } else {
        userAuth = true;
        setAuthenticated(true);
      }

      if (!userAuth) {
        login();
      }
    };

    handleAuthentication();

    const intervalId = setInterval(async () => {
      if (!localStorage.getItem("access_token")) {
        login();
      }
      if (isTokenExpired()) {
        try {
          await getAccessToken();
          setAuthenticated(true);
        } catch (error) {
          setAuthenticated(false);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return <>{isAuthenticated && children}</>;
};

export default AuthProvider;
