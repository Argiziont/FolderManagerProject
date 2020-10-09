import { IFolderData } from "../helpers";
import { history } from "../helpers";
import { IUserSubscribe } from "../helpers/IUserSubscribe";
import {
  FileHolderApi,
  FolderApi,
  UserApi,
} from "./AutorizationAPI/ClientApis";
import {
  ApiException,
  AuthenticateRequest,
  FileParameter,
  FileResponse,
  Folder,
  IFolder,
} from "./ClientAPI";
export const userService = {
  login,
  logout,
  getAllUsers,
  loadFolders,
  addFolders,
  deleteFolder,
  deleteFile,
  downloadFile,
  uploadFile,
};

async function login(username: string, password: string) {
  try {
    const response = await UserApi().authenticate(
      new AuthenticateRequest({ username: username, password: password })
    );

    const handledResponse = (await handleResponseBlob(
      response
    )) as IUserSubscribe;
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    sessionStorage.setItem("user", JSON.stringify(handledResponse));
    return handledResponse;
  } catch (error) {
    const exeption = await handleExeption(error);
    return exeption;
  }
}
function logout() {
  sessionStorage.removeItem("user");
}
async function getAllUsers() {
  // const requestOptions: any = {
  //   method: "GET",
  //   headers: {
  //     Authorization: authHeader().Authorization,
  //     Refresh: "Bearer " + authHeader().Refresh,
  //   },
  // };
  // const response = await fetch(`${ApiUrl}/User`, requestOptions);
  //  return handleResponse(response);
}
async function loadFolders() {
  try {
    const response = await FolderApi(getUserFromStorage()).get();
    const handledResponse = await handleResponseBlob(response);

    return handledResponse;
  } catch (error) {
    const exeption = await handleExeption(error);
    return exeption;
  }
}
async function addFolders(data: IFolderData) {
  try {
    const responseData: IFolder = {
      name: data.Name,
    };
    const response = await FolderApi(getUserFromStorage()).postFolder(
      new Folder(responseData)
    );
    const handledResponse = await handleResponseBlob(response);

    return handledResponse;
  } catch (error) {
    const exeption = await handleExeption(error);
    return exeption;
  }
}
async function deleteFile(id: number) {
  try {
    const response = await FileHolderApi(getUserFromStorage()).deleteFile(id);
    const handledResponse = await handleResponseBlob(response);

    return handledResponse;
  } catch (error) {
    const exeption = await handleExeption(error);
    return exeption;
  }
}
async function deleteFolder(id: number) {
  try {
    const response = await FolderApi(getUserFromStorage()).deleteFolder(id);
    const handledResponse = await handleResponseBlob(response);

    return handledResponse;
  } catch (error) {
    const exeption = await handleExeption(error);
    return exeption;
  }
}
async function downloadFile(id: number) {
  try {
    const response = await FileHolderApi(getUserFromStorage()).get(id);
    //const handledResponse = await handleResponseBlob(response);

    //Generate Download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    response.fileName && link.setAttribute("download", response?.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return response;
  } catch (error) {
    const exeption = await handleExeption(error);
    return exeption;
  }
}
async function uploadFile(formData: FormData, setprogressPercent: Function) {
  try {
    const fileData = formData.get("sendFile") as File;
    const folderId = Number(formData.get("Id"));
    const fileName = fileData.name;
    setprogressPercent(1);
    const param: FileParameter = { data: fileData, fileName: fileName };
    const response = await FileHolderApi(getUserFromStorage()).postFile(
      folderId,
      param
    );
    const handledResponse = await handleResponseBlob(response);
    setprogressPercent(100);
    return handledResponse;
  } catch (error) {
    setprogressPercent(100);
    const exeption = await handleExeption(error);
    return exeption;
  }
  ///Upload with axios, not fixed///

  // const requestOptions: any = {
  //   headers: {
  //     "content-type": "multipart/form-data",
  //     Authorization: authHeader().Authorization,
  //     Refresh: "Bearer " + authHeader().Refresh,
  //   },
  //   onUploadProgress: function (progressEvent: ProgressEvent) {
  //     var percentCompleted = Math.round(
  //       (progressEvent.loaded * 100) / progressEvent.total
  //     );
  //     setprogressPercent(percentCompleted);
  //   },
  // };
  // return axios
  //   .post(`${ApiUrl}/FileHolder`, formData, requestOptions)
  //   .then((response) => {
  //     return response;
  //   });
}
async function handleResponseBlob(response: FileResponse) {
  const text = await response.data.text();
  const data = text && JSON.parse(text);
  if (response.status !== 200 && response.status !== 206) {
    if (response.status === 401 && data.statusText === "Unauthorized") {
      // auto logout if 401 response returned from api
      logout();
      history.push("/Login");
    }

    const error = data.statusText;
    return Promise.reject(error);
  }
  return data;
}
async function handleExeption(error: ApiException) {
  if (error.status === 401 && error.response === "Unauthorized") {
    // auto logout if 401 response returned from api
    logout();
    history.push("/Login");
  }
  if (error.response) {
    const exeptionRefuse = JSON.parse(error.response);
    return Promise.reject(exeptionRefuse.statusText);
  }
}
function getUserFromStorage() {
  return sessionStorage.getItem("user") || "[]";
}
