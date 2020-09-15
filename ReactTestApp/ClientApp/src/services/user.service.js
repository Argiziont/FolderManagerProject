import Cookies from "universal-cookie";
import axios from "axios";

import { authHeader } from "../helpers";
import { history } from "../helpers/history";

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

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch("https://localhost:44396/user/authenticate", requestOptions)
    .then(handleResponse)
    .then((user) => {
      const cookies = new Cookies();
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      cookies.set("user", JSON.stringify(user), { path: "/" });
      return user;
    });
}
function getAllUsers() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch("https://localhost:44396/User", requestOptions).then(
    handleResponse
  );
}
function logout() {
  const cookies = new Cookies();
  // remove user from local storage to log user out
  cookies.remove("user", { path: "/" });
}
function loadFolders() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch("https://localhost:44396/Folder", requestOptions)
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function addFolders(data, UpdateData) {
  const cookies = new Cookies();
  const Senddata = {
    Name: data.Name,
    File: null,
  };
  let user = cookies.get("user");
  if (user && user.token) {
    return fetch("https://localhost:44396/Folder", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify(Senddata),
    })
      .then(handleResponse)
      .then((folder) => {
        UpdateData();
        return folder;
      });
  }
}
function deleteFile(id, UpdateData) {
  const cookies = new Cookies();
  let user = cookies.get("user");
  if (user && user.token) {
    return fetch("https://localhost:44396/FileHolder/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.token,
      },
    })
      .then(handleResponse)
      .then((file) => {
        UpdateData();
        return file;
      });
  }
}
function deleteFolder(id, UpdateData) {
  const cookies = new Cookies();
  let user = cookies.get("user");
  return fetch("https://localhost:44396/Folder/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + user.token,
    },
  })
    .then(handleResponse)
    .then((folder) => {
      UpdateData();
      return folder;
    });
}
function downloadFile(index) {
  const cookies = new Cookies();
  let user = cookies.get("user");
  return axios
    .get("https://localhost:44396/FileHolder/" + index, {
      responseType: "blob",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.token,
      },
    })
    .then((file) => {
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
    });
}
function uploadFile(formData, setprogressPercent) {
  const cookies = new Cookies();
  let user = cookies.get("user");
  const config = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: "Bearer " + user.token,
    },
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setprogressPercent(percentCompleted);
    },
  };
  return axios
    .post("https://localhost:44396/FileHolder", formData, config)
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}
function handleResponse(response) {
  return response.text().then((text) => {
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
  });
}
