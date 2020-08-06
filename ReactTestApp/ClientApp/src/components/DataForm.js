import React from "react";
import { useForm } from "react-hook-form";
import AddData from "./RESTDataManagment";
import PropTypes from "prop-types";

function DataForm({ UpdateData }) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data, e) => {
    await AddData((data = { data }), (UpdateData = { UpdateData }));
    e.target.reset();
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="Name">Folder Name</label>
          <input
            name="Name"
            placeholder="bill"
            ref={register({ required: true })}
          />
        </div>
        {errors.Name && <span>This field is required</span>}
        <br></br>
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
}

DataForm.propTypes = {
  UpdateData: PropTypes.func.isRequired,
};
export default DataForm;
