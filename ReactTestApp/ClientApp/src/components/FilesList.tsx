import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { userActions } from "../actions";

interface FilesListProps {
  FilesNamesArray: string[];
  FilesIdsArray: number[];
  UpdateHandler: Function;
  SnackCallback: Function;
}
interface renderRowProps {
  index: number;
  style: any;
  data: FilesListProps;
}
function renderRow(props: renderRowProps) {
  const handleDelete = () => {
    userActions.deleteFile(
      data.FilesIdsArray[index],
      () => data.UpdateHandler(),
      data.SnackCallback
    );
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
export const FilesList: React.FC<FilesListProps> = ({
  FilesNamesArray,
  UpdateHandler,
  FilesIdsArray,
  SnackCallback,
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: FilesNamesArray.length <= 7 ? 40 * FilesNamesArray.length : 400,
      minHeight:
        (FilesNamesArray.length <= 7 ? 40 * FilesNamesArray.length : 400) + 30,
      maxWidth: 400,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FixedSizeList
        height={400}
        width={400}
        itemSize={46}
        itemCount={FilesNamesArray.length}
        itemData={{
          FilesNamesArray: FilesNamesArray,
          FilesIdsArray: FilesIdsArray,
          UpdateHandler: UpdateHandler,
          SnackCallback: SnackCallback,
        }}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
};
