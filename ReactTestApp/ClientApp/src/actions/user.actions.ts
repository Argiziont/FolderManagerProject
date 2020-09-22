import { history } from "../helpers/history";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

import { userService } from "../services";
import { IFolderData } from "../helpers/IFolderData";
export const userActions = {
  login,
  logout,
  getAllUsers,
  loadFolders,
  addFolders,
  deleteFile,
  deleteFolder,
  downloadFile,
  uploadFile,
};

function login(
  username: string,
  password: string,
  SnackNotification: Function,
  SetConnection: Function
) {
  return userService.login(username, password).then(
    (user) => {
      SnackNotification(["Successfully logged in", "success", "Success"]);
      history.push("/");
      SetConnection(
        new HubConnectionBuilder()
          .withUrl("/hubs/Folders?token={" + user.accessToken + "}")
          .withAutomaticReconnect()
          .build()
      );
      return user;
    },
    (error) => {
      SnackNotification([
        "Username or password is incorrect or user already logged in",
        "error",
        "Error",
      ]);
      return error;
    }
  );
}
function logout(connection?: HubConnection) {
  userService.logout();
  connection?.stop();
  history.push("/Login");
}
function getAllUsers() {
  return userService.getAllUsers().then(
    (users) => {
      return users;
    },
    (error) => {
      return error;
    }
  );
}
function loadFolders() {
  return userService.loadFolders().then(
    (data) => {
      return data;
    },
    (error) => {
      return error;
    }
  );
}
function addFolders(
  data: IFolderData,
  UpdateData: Function,
  SnackNotification: Function
) {
  return userService.addFolders(data, UpdateData).then(
    (folder) => {
      SnackNotification(["Folder successfully added", "success", "Success"]);
      return folder;
    },
    (error) => {
      SnackNotification([error, "error", "Error"]);
      return error;
    }
  );
}
function deleteFile(
  id: number,
  UpdateData: Function,
  SnackNotification: Function
) {
  return userService.deleteFile(id, UpdateData).then(
    (file) => {
      SnackNotification(["File successfully deleted", "warning", "Warning"]);
      return file;
    },
    (error) => {
      SnackNotification([error, "error", "Error"]);
      return error;
    }
  );
}
function deleteFolder(
  id: number | string,
  UpdateData: Function,
  SnackNotification: Function
) {
  if (typeof id === "string") {
    id = +id;
  }
  return userService.deleteFolder(id, UpdateData).then(
    (folder) => {
      SnackNotification(["Folder successfully deleted", "warning", "Warning"]);
      return folder;
    },
    (error) => {
      SnackNotification([error, "error", "Error"]);
      return error;
    }
  );
}
function downloadFile(index: number) {
  return userService.downloadFile(index).then(
    (file) => {
      return file;
    },
    (error) => {
      return error;
    }
  );
}
function uploadFile(formData: FormData, setprogressPercent: Function) {
  return userService.uploadFile(formData, setprogressPercent).then(
    (response) => {
      return response;
    },
    (error) => {
      return error;
    }
  );
}
