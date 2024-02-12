import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import resource from "@/lib/resource";
import jsUtil from "@/lib/jsUtil";

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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function GIF({ action, onSaveAction, onDeleteAction }) {
  const [image, setImage] = useState(action["素材"]);
  const [pos, setPos] = useState(action["位置"]);
  const [ratio, setRatio] = useState(action["比例"]);
  const [degree, setDegree] = useState(action["度数"]);
  const [edit, setEdit] = useState(false);

  const [tmpImage, setTmpImage] = React.useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setTmpImage(i);
    }
  };

  const handleChange = (event) => {
    const value = jsUtil.convertUserInputNumbers(event.target.value);
    if (event.target.name == "素材") {
      setImage(value);
    }
    if (event.target.name == "位置") {
      setPos(value);
    }
    if (event.target.name == "比例") {
      setRatio(value);
    }
    if (event.target.name == "度数") {
      setDegree(value);
    }
  };

  const onSave = async () => {
    if (tmpImage != null) {
      const res = await resource.uploadToServer(tmpImage, "action_gif");
      if (res.code === 200) {
        onSaveAction({
          名称: "gif",
          素材: res.msg,
          位置: pos,
          比例: ratio,
          度数: degree,
        });
      }
    } else {
      onSaveAction({
        名称: "gif",
        素材: image,
        位置: pos,
        比例: ratio,
        度数: degree,
      });
    }
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setImage(action["素材"]);
    setPos(action["位置"]);
    setRatio(action["比例"]);
    setDegree(action["度数"]);
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
        gif
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: (edit && 300) || 360,
          p: 1,
          m: "auto",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {edit && (
            <>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <br></br>
                <Button component="label" variant="contained">
                  选择素材
                  <VisuallyHiddenInput
                    name="素材"
                    type="file"
                    onChange={uploadToClient}
                  />
                </Button>{" "}
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">位置的写法</Typography>
                      <ol>
                        <li>100:201,300:450</li>
                        <li>0.2,0.7</li>
                        <li>中心</li>
                        <li>中心,底部</li>
                      </ol>
                    </React.Fragment>
                  }
                >
                  <InputLabel>
                    <b>位置?</b>
                  </InputLabel>
                </HtmlTooltip>

                <Input
                  name="位置"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(action["位置"])}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">比例的写法</Typography>
                      0到1之间的小数
                    </React.Fragment>
                  }
                >
                  <InputLabel>
                    <b>比例?</b>
                  </InputLabel>
                </HtmlTooltip>
                <Input
                  name="比例"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(action["比例"])}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>度数</InputLabel>
                <Input
                  name="度数"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(action["度数"])}
                />
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
                image={action["素材"]}
                title={action["素材"]}
              />
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                位置: {jsUtil.convertNumbersToString(action["位置"])}
              </Typography>{" "}
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                比例: {jsUtil.convertNumbersToString(action["比例"])}
              </Typography>{" "}
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                度数: {jsUtil.convertNumbersToString(action["度数"])}
              </Typography>
              <br></br>
              <Button
                sx={{ m: 0, p: 1 }}
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
