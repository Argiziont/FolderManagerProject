import React from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { userActions } from "../actions";
interface FileElementPropsData {
  FilesNamesArray: string[];
  FilesIdsArray: number[];
  SnackCallback?: Function;
}
interface FileElementProps {
  index: number;
  style: any;
  data: FileElementPropsData;
}
export function FileElement(props: FileElementProps) {
  const handleDelete = () => {
    userActions.deleteFile(data.FilesIdsArray[index], data.SnackCallback);
  };
  const HandleDownload = () => {
    userActions.downloadFile(data.FilesIdsArray[index]);
  };
  const { index, style, data } = props;
  return (
    <ListItem button style={style} key={index}>
      <ListItemIcon>
        <FileCopyIcon />
      </ListItemIcon>

      <ListItemText
        primary={
          data.FilesNamesArray[index].length > 15
            ? data.FilesNamesArray[index].substring(0, 7) +
              " . . . " +
              data.FilesNamesArray[index].substring(
                data.FilesNamesArray[index].length - 7,
                data.FilesNamesArray[index].length
              )
            : data.FilesNamesArray[index]
        }
      />
      <IconButton
        onClick={HandleDownload}
        size="small"
        edge="end"
        aria-label="delete"
      >
        <SaveAltIcon />
      </IconButton>
      <IconButton
        onClick={handleDelete}
        size="small"
        edge="end"
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
