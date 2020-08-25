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
import FilesList from "./FilesList";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    display: "none",
  },
}));

export default function InteractiveList({
  FolderName,
  FilesNamesArray,
  DeleteHandler,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const arr = FilesNamesArray;
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={FolderName} />
                <ListItemSecondaryAction>
                  <input
                    className={classes.input}
                    id="icon-button-file"
                    type="file"
                    onChange={(event) => {
                      const formData = new FormData();
                      formData.append(
                        "myFile",
                        event.target.files[0],
                        event.target.files[0].name
                      );
                      console.log(event.target.files[0]);
                      console.log(formData);
                    }}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton aria-label="upload picture" component="span">
                      <AddIcon />
                    </IconButton>
                  </label>

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
                    onClick={DeleteHandler}
                    edge="end"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem className={classes.nested}>
                    <FilesList FilesNamesArray={FilesNamesArray}></FilesList>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
