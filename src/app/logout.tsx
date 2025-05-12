import AuthConfig from "../api/AuthConfig.json";

const authEnv: keyof typeof AuthConfig = import.meta.env
  .VITE_REACT_APP_AUTH_CONFIG as keyof typeof AuthConfig;

const redirectToLogout = () => {
  const authConfig = AuthConfig[authEnv];
  if (!authConfig.serverUrl || !authConfig.logoutPath) {
    console.error("Server URL or logout path is missing in the config.");
    return;
  }

  const queryParams = new URLSearchParams();
  if (authConfig.clientId) queryParams.append("client_id", authConfig.clientId);
  if (authConfig.tenantId) queryParams.append("tenantId", authConfig.tenantId);
  if (authConfig.responseType)
    queryParams.append("response_type", authConfig.responseType);
  if (authConfig.redirectUri)
    queryParams.append("post_logout_redirect_uri", authConfig.redirectUri);

  const refreshToken = localStorage.getItem("refresh_token");
  if (refreshToken) queryParams.append("refreshToken", refreshToken);

  const url = `${authConfig.serverUrl}${
    authConfig.logoutPath
  }?${queryParams.toString()}`;
  window.location.href = url;

  // Clear tokens
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("id_token");
};

export const logout = async () => {
  try {
    if (AuthConfig[authEnv].logoutAPIUrl) {
      const response = await fetch(AuthConfig[authEnv].logoutAPIUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          global: false,
          refreshToken: localStorage.getItem("refresh_token"),
        }),
      });

      if (!response.ok) {
        throw new Error(`Logout API request failed: ${response.statusText}`);
      }

      // If the logout API call succeeds, clear tokens and perform redirect.
      if (response.status === 200) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("id_token");
      }
    }
    redirectToLogout();
  } catch (error) {
    console.error("Logout API request failed:", error);
    redirectToLogout();
  }
};
