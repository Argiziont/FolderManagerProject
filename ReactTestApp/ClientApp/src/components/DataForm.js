import React from "react";
import { useForm } from "react-hook-form";

export function DataForm() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
    //AddPhone(data);
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="Name">File Name</label>
          <input
            name="Name"
            placeholder="bill"
            ref={register({ required: true })}
          />
        </div>
        {errors.Name && <span>This field is required</span>}
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
