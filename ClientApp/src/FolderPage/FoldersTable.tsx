import React from "react";
import { IFolder } from "../helpers";
import { InteractiveList } from "../components";
import { userActions } from "../actions";

interface FoldersTableProps {
  folders: IFolder[];
  SnackCallback?: Function;
}
export const FoldersTable: React.FC<FoldersTableProps> = ({
  folders,
  SnackCallback,
}) => {
  return (
    <div>
      {folders.map((folder) => (
        <InteractiveList
          key={folder.folderId}
          folder={folder}
          // FolderName={folder.folderName}
          // FilesNamesArray={folder.filesNames}
          // FilesIdsArray={folder.filesIds}
          // FolderId={folder.folderId}

          DeleteHandler={async () =>
            userActions.deleteFolder(folder.folderId, SnackCallback)
          }
          SnackCallback={SnackCallback}
        ></InteractiveList>
      ))}
    </div>
  );
};
