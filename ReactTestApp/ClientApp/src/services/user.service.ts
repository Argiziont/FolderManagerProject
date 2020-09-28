import axios from "axios";

import { authHeader } from "../helpers";
import { IFolderData } from "../helpers";
import { history } from "../helpers";
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
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  const response = await fetch(
    "https://localhost:44396/user/authenticate",
    requestOptions
  );
  const user = await handleResponse(response);
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  sessionStorage.setItem("user", JSON.stringify(user));
  return user;
}
function logout() {
  sessionStorage.removeItem("user");
}
async function getAllUsers() {
  const requestOptions: any = {
    method: "GET",
    headers: {
      Authorization: authHeader().Authorization,
      Refresh: "Bearer " + authHeader().Refresh,
    },
  };

  const response = await fetch("https://localhost:44396/User", requestOptions);
  return handleResponse(response);
}
async function loadFolders() {
  const requestOptions: any = {
    method: "GET",
    headers: authHeader(),
  };
  const response = await fetch(
    "https://localhost:44396/Folder",
    requestOptions
  );
  const data = await handleResponse(response);
  return data;
}
async function addFolders(data: IFolderData, UpdateData: Function) {
  const Senddata = {
    Name: data.Name,
    File: null,
  };
  const requestOptions: any = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: authHeader().Authorization,
      Refresh: "Bearer " + authHeader().Refresh,
    },
    body: JSON.stringify(Senddata),
  };
  const response = await fetch(
    "https://localhost:44396/Folder",
    requestOptions
  );
  const folder = await handleResponse(response);
  UpdateData();
  return folder;
}
async function deleteFile(id: number, UpdateData: Function) {
  const requestOptions: any = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: authHeader().Authorization,
      Refresh: "Bearer " + authHeader().Refresh,
    },
  };
  const response = await fetch(
    "https://localhost:44396/FileHolder/" + id,
    requestOptions
  );
  const file = await handleResponse(response);
  UpdateData();
  return file;
}
async function deleteFolder(id: number, UpdateData: Function) {
  const requestOptions: any = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: authHeader().Authorization,
      Refresh: "Bearer " + authHeader().Refresh,
    },
  };
  const response = await fetch(
    "https://localhost:44396/Folder/" + id,
    requestOptions
  );
  const folder = await handleResponse(response);
  UpdateData();
  return folder;
}
async function downloadFile(index: number) {
  const requestOptions: any = {
    responseType: "blob",
    headers: {
      "Content-type": "application/json",
      Authorization: authHeader().Authorization,
      Refresh: "Bearer " + authHeader().Refresh,
    },
  };
  const file = await axios.get(
    "https://localhost:44396/FileHolder/" + index,
    requestOptions
  );
  const url = window.URL.createObjectURL(new Blob([file.data]));
  const link = document.createElement("a");
  //Getting name
  let filename;
  let headerLine = file.headers["content-disposition"];
  let headerSplit = headerLine.split(";");
  if (headerLine.indexOf('"') !== -1) {
    let headerNameSplit = headerSplit[1].split('"');
    filename = headerNameSplit[1];
  } else {
    filename = headerSplit[1].substring(10, headerSplit[1].length);
  }
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  return file;
}
function uploadFile(formData: FormData, setprogressPercent: Function) {
  const requestOptions: any = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: authHeader().Authorization,
      Refresh: "Bearer " + authHeader().Refresh,
    },
    onUploadProgress: function (progressEvent: ProgressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setprogressPercent(percentCompleted);
    },
  };
  return (
    axios
      .post("https://localhost:44396/FileHolder", formData, requestOptions)
      //.then(handleResponse)
      .then((response) => {
        return response;
      })
  );
}
async function handleResponse(response: Response) {
  const text = await response.text();
  const data = text && JSON.parse(text);
  if (!response.ok) {
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
