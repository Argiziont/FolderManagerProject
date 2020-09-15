import { history } from "../helpers/history";
import { userService } from "../services";
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

function login(username, password, SnackNotification) {
  return userService.login(username, password).then(
    (user) => {
      SnackNotification(["Successfully logged in", "success", "Success"]);
      history.push("/");
      return user;
    },
    (error) => {
      SnackNotification([error, "error", "Error"]);
      return error;
    }
  );
}
function logout() {
  userService.logout();
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
function addFolders(data, UpdateData, SnackNotification) {
  return userService.addFolders(data, UpdateData).then(
    (folder) => {
      SnackNotification(["File successfully added", "success", "Success"]);
      return folder;
    },
    (error) => {
      SnackNotification([error, "error", "Error"]);
      return error;
    }
  );
}
function deleteFile(id, UpdateData, SnackNotification) {
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
function deleteFolder(id, UpdateData, SnackNotification) {
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
function downloadFile(index) {
  return userService.downloadFile(index).then(
    (file) => {
      return file;
    },
    (error) => {
      return error;
    }
  );
}
function uploadFile(formData, setprogressPercent) {
  return userService.uploadFile(formData, setprogressPercent).then(
    (response) => {
      return response;
    },
    (error) => {
      return error;
    }
  );
}
