import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import { grey, red } from "@mui/material/colors";
import resource from "../lib/resource";
import { throws } from "assert";

export default function FullFeaturedCrudGrid({
  folder,
  columns,
  data,
  onSave = null,
  onDelete = null,
  enableEdit = false,
  enableDelete = false,
  showEditToolbar = false,
}) {
  const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState({});

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      let values = { id, isNew: true }; //key: "", value: "", char: "",
      for (var i = 0; i < columns.length; i++) {
        values[columns[i]["field"]] = "";
      }
      setRows((oldRows) => [...oldRows, values]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "value" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          添加
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        rows[i].isNew = false;
      }
    }
  };

  const handleDeleteClick = (id) => () => {
    let newrows = [];
    let index = -1;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id !== id) {
        newrows.push(rows[i]);
      } else {
        index = i;
      }
    }
    setRows(newrows);
    // setRows(rows.filter((row) => row.id !== id));
    onDelete(index);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const l = columns.length;
    console.log("newRow: ", newRow);
    let oldRow = rows.find((row) => row.id === newRow.id);
    console.log("oldRow: ", oldRow);
    for (var i = 0; i < l; i++) {
      const field = columns[i].field;

      if (newRow[field] === oldRow[field]) {
        // column没改变
        continue;
      }
      if (columns[i].type == "file") {
        const value = await resource.uploadToServer(
          newRow[field],
          `${folder}/datagrid/${newRow.id}-${columns[i].field}`
        );
        if (value.code === 200) {
          newRow[field] = value.msg;
        }
      }
    }
    oldRow = newRow;
    let index = -1;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === newRow.id) {
        index = i;
        break;
      }
    }
    onSave(index, newRow);
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const allcolumns = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "动作",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        let actions = [];
        if (enableEdit) {
          actions.push(
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          );
        }
        if (enableDelete) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          );
        }
        return actions;
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 200,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        hideFooter={true}
        rows={rows}
        columns={allcolumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={
          showEditToolbar && {
            toolbar: EditToolbar,
          }
        }
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        onProcessRowUpdateError={(error) => {
          console.log(error);
        }}
      />
    </Box>
  );
}
