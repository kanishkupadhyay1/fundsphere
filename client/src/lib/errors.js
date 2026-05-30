export const getApiErrorMessage = (error) => {
  const data = error?.response?.data;

  if (data?.message) return data.message;
  if (typeof data === 'string' && data.trim()) {
    if (data.trim().startsWith('<!doctype') || data.trim().startsWith('<html')) {
      return 'The API is not reachable from this deployment. Check VITE_API_URL or deploy the backend with the frontend.';
    }
    return data;
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the server. Check the deployed API URL and CORS CLIENT_URL setting.';
  }

  if (error?.response?.status === 404) {
    return 'The authentication API route was not found on this deployment.';
  }

  return 'Unable to continue. Please check the details.';
};
