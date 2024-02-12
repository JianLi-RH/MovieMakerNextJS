import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import jsUtil from "@/lib/jsUtil";

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

export default function Walk({
  action,
  allChars,
  onSaveAction,
  onDeleteAction,
}) {
  const [name, setName] = useState(action["角色"]);
  const [startPos, setStartPos] = useState(action["开始位置"]);
  const [endPos, setEndPos] = useState(action["结束位置"]);
  const [ratio, setRatio] = useState(action["比例"]);
  const [mode, setMode] = useState(action["方式"]);
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    const value = jsUtil.convertUserInputNumbers(event.target.value);
    if (event.target.name == "角色") {
      setName(value);
    }
    if (event.target.name == "开始位置") {
      setStartPos(value);
    }
    if (event.target.name == "结束位置") {
      setEndPos(value);
    }
    if (event.target.name == "比例") {
      setRatio(value);
    }
    if (event.target.name == "方式") {
      setMode(value);
    }
  };

  const onSave = () => {
    onSaveAction({
      名称: "行进",
      角色: name,
      开始位置: startPos,
      结束位置: endPos,
      比例: ratio,
      方式: mode,
    });
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setName(action["角色"]);
    setStartPos(action["开始位置"]);
    setEndPos(action["结束位置"]);
    setRatio(action["比例"]);
    setMode(action["方式"]);
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
        行进
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: (edit && 360) || 260,
          p: 1,
          m: "auto",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {edit && (
            <>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>角色</InputLabel>
                <Select
                  name="角色"
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
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">开始位置的写法</Typography>
                      <ol>
                        <li>100,201</li>
                        <li>0.2,0.7</li>
                        <li>中心</li>
                        <li>中心,底部</li>
                      </ol>
                    </React.Fragment>
                  }
                >
                  <InputLabel>
                    <b>开始位置?</b>
                  </InputLabel>
                </HtmlTooltip>
                <Input
                  name="开始位置"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(
                    action["开始位置"]
                  )}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">结束位置的写法</Typography>
                      <ol>
                        <li>100,201</li>
                        <li>0.2,0.7</li>
                        <li>中心</li>
                        <li>中心,底部</li>
                      </ol>
                    </React.Fragment>
                  }
                >
                  <InputLabel>
                    <b>结束位置?</b>
                  </InputLabel>
                </HtmlTooltip>
                <Input
                  name="结束位置"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(
                    action["结束位置"]
                  )}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>比例</InputLabel>
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
                <InputLabel>方式</InputLabel>
                <Select
                  name="方式"
                  value={action["方式"]}
                  onChange={(e) => handleChange(e)}
                  label="方式"
                >
                  {["自然", "旋转"].map((m, i) => {
                    let selected = false;
                    if (m == action["方式"]) {
                      selected = true;
                    }
                    return (
                      <MenuItem key={i} selected={selected} value={m}>
                        {m}
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
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                角色: {action["角色"]}
              </Typography>
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                开始位置: {jsUtil.convertNumbersToString(action["开始位置"])}
              </Typography>{" "}
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                结束位置: {jsUtil.convertNumbersToString(action["结束位置"])}
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
                方式: {action["方式"]}
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
