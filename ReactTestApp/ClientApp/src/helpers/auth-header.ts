import { IAuth } from "./IAuth";

export function authHeader(): IAuth {
  // return authorization header with jwt token
  let user = JSON.parse(sessionStorage.getItem("user") || "[]");
  if (user && user.accessToken) {
    const AuthData: IAuth = {
      Authorization: "Bearer " + user.accessToken,
      Refresh: "Bearer " + user.refreshToken,
    };
    return AuthData;
  } else {
    return {};
  }
}
