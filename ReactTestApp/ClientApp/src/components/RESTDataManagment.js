import PropTypes from "prop-types";

async function loadData() {
  const response = await fetch("Folder");
  const data = await response.json();
  return data;
}

async function AddData(data, UpdateData) {
  const Senddata = {
    Name: data.Name,
    File: null,
    TmpFileNames: null,
  };
  await fetch("https://localhost:44396/Folder", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(Senddata),
  });

  await UpdateData();
}
AddData.propTypes = {
  UpdateData: PropTypes.func.isRequired,
  data: PropTypes.number,
};

async function DeleteFolder(id, UpdateData) {
  await fetch("https://localhost:44396/Folder/" + id, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });

  await UpdateData();
}
DeleteFolder.propTypes = {
  UpdateData: PropTypes.func.isRequired,
  id: PropTypes.number,
};

export { AddData, DeleteFolder, loadData };
