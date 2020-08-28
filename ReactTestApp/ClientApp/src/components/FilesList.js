import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { DeleteFile } from "./RESTDataManagment";
function renderRow(props) {
  const handleDelete = () => {
    DeleteFile(data.idsArray[index], () => data.UpdateHandler());
  };
  const { index, style, data } = props;
  return (
    <ListItem button style={style} key={index}>
      <ListItemIcon>
        <FileCopyIcon />
      </ListItemIcon>

      <ListItemText
        primary={
          data.itemsArray[index].length > 15
            ? data.itemsArray[index].substring(0, 7) +
              " . . . " +
              data.itemsArray[index].substring(
                data.itemsArray[index].length - 7,
                data.itemsArray[index].length
              )
            : data.itemsArray[index]
        }
      />
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

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default function FilesList({
  FilesNamesArray,
  UpdateHandler,
  FilesIdsArray,
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: FilesNamesArray.length <= 7 ? 40 * FilesNamesArray.length : 400,
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
          itemsArray: FilesNamesArray,
          idsArray: FilesIdsArray,
          UpdateHandler: UpdateHandler,
        }}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
