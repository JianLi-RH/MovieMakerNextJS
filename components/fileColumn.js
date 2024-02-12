import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { GRID_STRING_COL_DEF, useGridApiContext } from "@mui/x-data-grid";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});


export default function GridEditFileCell({ id, field, value, colDef }) {
  const apiRef = useGridApiContext();

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.files[0],
      });
    }
  };

  return (
    <Button component="label" variant="text">
      上传文件
      <VisuallyHiddenInput name="文件" type="file" onChange={uploadToClient} />
    </Button>
  );
}
