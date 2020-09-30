import React from "react";
import { IFolder } from "../helpers";
import { InteractiveList } from "../components";
import { userActions } from "../actions";

interface FoldersTableProps {
  folders?: IFolder[];
  UpdateFoldedData: Function;
  SnackCallback: Function;
}
export const FoldersTable: React.FC<FoldersTableProps> = ({
  folders,
  UpdateFoldedData,
  SnackCallback,
}) => {
  return (
    <div>
      {folders?.map((folder) => (
        <InteractiveList
          key={folder.folderId}
          FolderName={folder.folderName}
          FilesNamesArray={folder.filesNames}
          FilesIdsArray={folder.filesIds}
          FolderId={folder.folderId}
          DeleteHandler={async () =>
            userActions.deleteFolder(
              folder.folderId,
              () => UpdateFoldedData(),
              SnackCallback
            )
          }
          UpdateHandler={() => UpdateFoldedData()}
          SnackCallback={SnackCallback}
        ></InteractiveList>
      ))}
    </div>
  );
};
