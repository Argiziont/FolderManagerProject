import { IAuth } from "../../helpers";

export const createFetchApi = (userToken: IAuth) => {
  if (userToken === null) {
    //throw Error("Token must me initialized");
  }
  return {
    fetch: async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
      const authAccessHeader = {
        Authorization: `Bearer ${userToken.Authorization}`,
      };
      const authRefreshHeader = { Refresh: `Bearer " + ${userToken.Refresh}` };

      let defaultHeaders = {
        Accept: "application/json, text/plain, */*",
        ...authAccessHeader,
        ...authRefreshHeader,
      };

      return fetch(url, {
        ...init,
        headers: {
          ...defaultHeaders,
          ...init?.headers,
        },
      }).then((response) => {
        if (response.status === 401) {
          sessionStorage.removeItem("user");
        }
        return response;
      });
    },
  };
};
