import PropTypes from "prop-types";
export async function loadData() {
  const response = await fetch("Folder");
  const data = await response.json();
  return data;
}

async function AddData({ data, UpdateData }) {
  const Senddata = {
    Name: data.Name,
    File: null,
  };
  fetch("https://localhost:44396/Folder", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(Senddata),
  }).then(() => {
    UpdateData();
  });
}
AddData.propTypes = {
  UpdateData: PropTypes.func.isRequired,
  data: PropTypes.number,
};
export default AddData;
