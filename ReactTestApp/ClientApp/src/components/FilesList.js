import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const itemsArray = [
  { name: "Drake" },
  { name: "Halsey" },
  { name: "Camillo Cabello" },
  { name: "Travis Scott" },
  { name: "Bazzi" },
  { name: "Flume" },
  { name: "Nicki Minaj" },
  { name: "Kodak Black" },
  { name: "Tyga" },
  { name: "Buno Mars" },
  { name: "Lil Wayne" },
];

function renderRow(props) {
  const { index, style, data } = props;
  return (
    <ListItem button style={style} key={index}>
      <ListItemIcon>
        <FileCopyIcon />
      </ListItemIcon>
      <ListItemText primary={data.itemsArray[index]} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default function FilesList({ FilesNamesArray }) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: FilesNamesArray.length < 10 ? 40 * FilesNamesArray.length : 400,
      maxWidth: 300,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FixedSizeList
        height={200}
        width={300}
        itemSize={46}
        itemCount={FilesNamesArray.length}
        itemData={{ itemsArray: FilesNamesArray }}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
