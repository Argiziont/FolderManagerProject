import React from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FolderIcon from "@material-ui/icons/Folder";
import TextField from "@material-ui/core/TextField";

import { userActions } from "../actions";
import { IFolderData } from "../helpers";
import { Box } from "@material-ui/core";

interface FolderManagmentFormProprs {
  UpdateData: Function;
  SnackNotification: Function;
}
export const FolderManagmentForm: React.FC<FolderManagmentFormProprs> = ({
  UpdateData,
  SnackNotification,
}) => {
  const { register, handleSubmit, reset, errors } = useForm();
  const onSubmit = (data: IFolderData) => {
    userActions.addFolders(data, UpdateData, SnackNotification);
    reset();
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Box ml={3} mt={2}>
          <Grid
            container
            spacing={2}
            justify="space-around"
            alignItems="flex-end"
          >
            <Grid item xs={1}>
              <FolderIcon />
            </Grid>
            <Grid item xs={7}>
              <TextField
                name="Name"
                label="*Folder name"
                id="Name"
                inputRef={register({
                  required: true,
                })}
                error={errors.Name && true}
              />
            </Grid>
            <Grid item xs={4}>
              <Button name="SubmitButton" color="primary" type="submit">
                Send
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};
