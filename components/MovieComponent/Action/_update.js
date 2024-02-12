import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import resource from "@/lib/resource";

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

export default function UpdateChar({
  action,
  allChars,
  onSaveAction,
  onDeleteAction,
}) {
  const [image, setImage] = useState(action["角色"]["素材"]);
  const [name, setName] = useState(action["角色"]["名字"]);
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const uploadToClient = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      const res = await resource.uploadToServer(i, "action");
      if (res.code === 200) {
        setImage(res.msg);
      }
    }
  };

  const onSave = () => {
    let c = Object.assign({}, action);
    c["角色"]["名字"] = name;
    c["角色"]["素材"] = image;
    console.log("onSave: ", c);
    onSaveAction(c);
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setImage(action["角色"]["素材"]);
    setName(action["角色"]["名字"]);
    setEdit(false);
  };

  return (
    <Box sx={{ bgcolor: "#aabb44", p: 1 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
        }}
        component="div"
      >
        更新
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: (edit && 140) || 240,
          p: 1,
          m: "auto",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {edit && (
            <>
              <Button component="label" variant="contained">
                选择角色图片
                <VisuallyHiddenInput
                  name="素材"
                  type="file"
                  onChange={uploadToClient}
                />
              </Button>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>角色</InputLabel>
                <Select
                  value={name}
                  onChange={(e) => handleChange(e)}
                  label="角色"
                >
                  {allChars.length > 0 &&
                    allChars.map((cName, i) => {
                      let selected = false;
                      if (name == cName) {
                        selected = true;
                      }
                      return (
                        <MenuItem key={i} selected={selected} value={cName}>
                          {cName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <CardActions sx={{ m: 0, p: 0 }}>
                <Button
                  sx={{ m: 0, p: 0 }}
                  variant="text"
                  onClick={() => onSave()}
                >
                  保存
                </Button>
                <Button
                  sx={{ m: 0, p: 0 }}
                  variant="text"
                  onClick={() => onCancel()}
                >
                  取消
                </Button>
              </CardActions>
            </>
          )}
          {!edit && (
            <>
              <CardMedia
                sx={{ height: 160, width: 120, alignItems: "center" }}
                image={image}
                title={name}
              />
              <Typography gutterBottom variant="h6" component="div">
                {name}
              </Typography>
              <Button
                sx={{ m: 0, p: 0 }}
                variant="text"
                onClick={() => setEdit(true)}
              >
                编辑
              </Button>
              <Button
                sx={{ m: 0, p: 0 }}
                variant="text"
                onClick={() => onDelete()}
              >
                删除
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
