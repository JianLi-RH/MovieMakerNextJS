import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import resource from "@/lib/resource";
import jsUtil from "@/lib/jsUtil";

const ariaLabel = { "aria-label": "description" };
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

export default function Character(props) {
  const [edit, setEdit] = React.useState(false);
  const [char, setChar] = React.useState({
    名字: props.name,
    素材: props.image,
    位置: props.pos,
    大小: props.size,
    显示: props.display,
    图层: props.index,
    角度: props.rotate,
  });
  const [image, setImage] = React.useState(null);
  const [changed, setChanged] = React.useState(false);
  console.log()

  const save = async () => {
    if (changed == true) {
      let c = { ...char };
      if (image != null) {
        const res = await resource.uploadToServer(
          image,
          `character/${char["名字"]}`
        );
        if (res.code === 200) {
          c["素材"] = res.msg;
        }
      }
      props.onSave(c);
      setChar(c);
      setEdit(false);
    } else {
      console.log("角色没有修改");
    }
  };

  const remove = () => {
    props.remove(props.i);
  };

  const handleChange = (event) => {
    let c = { ...char };
    c[event.target.name] = jsUtil.convertUserInputNumbers(event.target.value);
    setChar(c);
    setChanged(true);
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setChanged(true);
    }
  };

  return (
    <Card
      component="div"
      sx={{
        width: 180,
        minWidth: 180,
        height: 380,
        p: 1,
        m: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {edit && (
          <>
            <br></br>
            <Button component="label" variant="contained">
              选择素材
              <VisuallyHiddenInput
                name="素材"
                type="file"
                onChange={uploadToClient}
              />
            </Button>{" "}
            <br></br>
            <br></br>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              size="small"
              sx={{ m: 0, p: 0 }}
            >
              角色：
              <Input
                name="名字"
                size="small"
                sx={{ width: "80px" }}
                type="string"
                onChange={(e) => handleChange(e)}
                defaultValue={props.name}
                inputProps={ariaLabel}
              />
              <br></br>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">位置的写法</Typography>
                    <ol>
                      <li>100,450</li>
                      <li>0.2,0.7</li>
                      <li>中心</li>
                      <li>中心,底部</li>
                    </ol>
                  </React.Fragment>
                }
              >
                <span>
                  <b>位置?：</b>
                </span>
              </HtmlTooltip>
              <Input
                name="位置"
                size="small"
                sx={{ width: "80px" }}
                type="string"
                onChange={(e) => handleChange(e)}
                defaultValue={jsUtil.convertNumbersToString(props.pos)}
                inputProps={ariaLabel}
              />
              <br></br>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">大小的写法</Typography>
                    <ol>
                      <li>100,450</li>
                      <li>0.2,0.7</li>
                    </ol>
                  </React.Fragment>
                }
              >
                <span>
                  <b>大小?：</b>
                </span>
              </HtmlTooltip>
              <Input
                name="大小"
                size="small"
                sx={{ width: "80px" }}
                type="string"
                onChange={(e) => handleChange(e)}
                defaultValue={jsUtil.convertNumbersToString(props.size)}
                inputProps={ariaLabel}
              />
              <br></br>
              角度：
              <Input
                name="角度"
                size="small"
                sx={{ width: "80px" }}
                type="string"
                onChange={(e) => handleChange(e)}
                defaultValue={props.rotate}
                inputProps={ariaLabel}
              />
              <br></br>
              图层：
              <Input
                name="图层"
                size="small"
                sx={{ width: "80px" }}
                type="number"
                onChange={(e) => handleChange(e)}
                defaultValue={props.index}
                inputProps={ariaLabel}
              />
              <br></br>
              显示：
              <Switch
                size="small"
                name="显示"
                defaultChecked={(props.display == "是" && true) || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    e.target.value = "是";
                  } else {
                    e.target.value = "否";
                  }
                  handleChange(e);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
              <br></br>
            </Typography>
          </>
        )}
        {!edit && (
          <>
            <CardMedia
              sx={{ height: 160, width: 120, alignItems: "center" }}
              image={props.image}
              title={props.name}
            />
            <Typography gutterBottom variant="h6" component="div">
              {props.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              size="small"
            >
              位置：
              {jsUtil.convertNumbersToString(props.pos)}
              <br></br>
              大小：
              {jsUtil.convertNumbersToString(props.size)}
              <br></br>
              角度： {props.rotate} <br></br>
              图层： {props.index} <br></br>
              显示： {props.display} <br></br>
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions sx={{ m: 0, p: 0 }}>
        {edit && (
          <>
            <Button sx={{ m: 0, p: 0 }} variant="text" onClick={() => save()}>
              保存
            </Button>
            <Button
              sx={{ m: 0, p: 0 }}
              variant="text"
              onClick={() => setEdit(false)}
            >
              取消
            </Button>
          </>
        )}

        {!edit && (
          <>
            <Button
              sx={{ m: 0, p: 0 }}
              variant="text"
              onClick={() => setEdit(true)}
            >
              编辑
            </Button>
            <Button sx={{ m: 0, p: 0 }} variant="text" onClick={() => remove()}>
              删除
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
