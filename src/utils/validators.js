export function isValidToken(token) {
  // Example: check if token exists and is a non-empty string
  if (!token || typeof token !== "string") return false;

  // Optionally, decode JWT and check expiry here
  // For example, using jwt-decode:
  // const { exp } = jwtDecode(token);
  // return exp * 1000 > Date.now();

  return true;
}