import { ApiUrl } from "../../helpers";
import { FileHolderClient, FolderClient, UserClient } from "../ClientAPI";
import { createFetchApi } from "./createFetchApi";

export const UserApi = () => {
  return new UserClient(ApiUrl);
};
export const FolderApi = (tokenHolder: string) => {
  return new FolderClient(
    ApiUrl,
    createFetchApi({
      Authorization: JSON.parse(tokenHolder).accessToken,
      Refresh: JSON.parse(tokenHolder).refreshToken,
    })
  );
};

export const FileHolderApi = (tokenHolder: string) => {
  return new FileHolderClient(
    ApiUrl,
    createFetchApi({
      Authorization: JSON.parse(tokenHolder).accessToken,
      Refresh: JSON.parse(tokenHolder).refreshToken,
    })
  );
};
