import { authHeader } from "../helpers";
import Cookies from "universal-cookie";
import { history } from "../helpers/history";

export const userService = {
  login,
  logout,
  getAllUsers,
  loadFolders,
  addFolders,
  deleteFile,
  deleteFolder,
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

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        history.push("/Login");
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
