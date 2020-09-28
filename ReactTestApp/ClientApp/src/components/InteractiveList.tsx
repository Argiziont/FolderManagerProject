import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { FilesList } from "./FilesList";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { userActions } from "../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  list: {
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    display: "none",
  },
}));
interface CircularProgressWithLabelProps {
  value: number;
}

function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface InteractiveListProprs {
  FolderName: string;
  FolderId: number;
  FilesNamesArray: string[];
  FilesIdsArray: number[];
  UpdateHandler: Function;
  SnackCallback: Function;
  DeleteHandler: Function;
}
export const InteractiveList: React.FC<InteractiveListProprs> = ({
  FolderName,
  FolderId,
  FilesNamesArray,
  DeleteHandler,
  UpdateHandler,
  FilesIdsArray,
  SnackCallback,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const [progressPercent, setprogressPercent] = React.useState<number>(0);
  //const arr = FilesNamesArray;
  const handleClick = () => {
    setOpen(!open);
  };
  const handleUpdate = (event: React.FormEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const file = (event.target as HTMLInputElement).files;
    if (file) {
      formData.append("sendFile", file[0], file[0].name);
      // Details of the uploaded file
      formData.append("Id", FolderId.toString());
      // Request made to the backend api
      // Send formData object

      userActions.uploadFile(formData, setprogressPercent).then((response) => {
        UpdateHandler();
        SnackCallback(["File successfully uploaded", "success", "Success"]);
      });
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <div className={classes.list}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={FolderName} />
                <ListItemSecondaryAction>
                  {progressPercent > 0 && progressPercent !== 100 ? (
                    <IconButton>
                      <CircularProgressWithLabel value={progressPercent} />
                    </IconButton>
                  ) : (
                    <Button
                      size="medium"
                      component="label"
                      startIcon={<AddIcon />}
                    >
                      <input
                        onChange={handleUpdate}
                        onClick={() => UpdateHandler()}
                        type="file"
                        className={classes.input}
                      />
                    </Button>
                  )}

                  {FilesNamesArray != null && FilesNamesArray.length > 0 ? (
                    <IconButton onClick={handleClick} aria-label="expand">
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  ) : (
                    <IconButton>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => DeleteHandler()}
                    edge="end"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem>
                    <FilesList
                      FilesNamesArray={FilesNamesArray}
                      UpdateHandler={UpdateHandler}
                      FilesIdsArray={FilesIdsArray}
                      SnackCallback={SnackCallback}
                    ></FilesList>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
