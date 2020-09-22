import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

import { userActions } from "../actions";
import { IFolderData } from "../helpers/IFolderData";

type DataFormProprs = {
  UpdateData: Function;
  SnackNotification: Function;
};
export const DataForm: React.FC<DataFormProprs> = ({
  UpdateData,
  SnackNotification,
}) => {
  const { register, handleSubmit, reset, errors } = useForm<IFolderData>();
  const onSubmit = (data: IFolderData) => {
    userActions.addFolders(data, UpdateData, SnackNotification);
    reset();
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input
          name="Name"
          placeholder="bill"
          ref={register({
            required: true,
          })}
        />
        &nbsp;
        <Button name="SubmitButton" color="primary" type="submit">
          Send
        </Button>
      </form>
      {errors.Name && <span> This field is required </span>}
    </div>
  );
};

DataForm.propTypes = {
  UpdateData: PropTypes.func.isRequired,
};
export default DataForm;
