import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FixedSizeList } from "react-window";

import { FileElement } from "./FileElement";

interface FilesListProps {
  FilesNamesArray: string[];
  FilesIdsArray: number[];
  SnackCallback?: Function;
}
export const FilesList: React.FC<FilesListProps> = ({
  FilesNamesArray,
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
          SnackCallback: SnackCallback,
        }}
      >
        {FileElement}
      </FixedSizeList>
    </div>
  );
};
