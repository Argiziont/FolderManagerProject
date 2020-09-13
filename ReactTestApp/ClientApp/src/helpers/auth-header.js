import Cookies from "universal-cookie";
export function authHeader() {
  const cookies = new Cookies();
  // return authorization header with jwt token
  let user = cookies.get("user");
  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}
