import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
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

export default function Camera({ action, onSaveAction, onDeleteAction }) {
  const [focus, setFocus] = useState(action["焦点"]);
  const [change, setChange] = useState(action["变化"]);
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    const value = jsUtil.convertUserInputNumbers(event.target.value);
    if (event.target.name == "焦点") {
      setFocus(value);
    }
    if (event.target.name == "变化") {
      setChange(value);
    }
  };

  const onSave = () => {
    onSaveAction({ 名称: "镜头", 焦点: focus, 变化: change });
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setFocus(action["焦点"]);
    setChange(action["变化"]);
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
        镜头
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: (edit && 160) || 120,
          p: 1,
          m: "auto",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {edit && (
            <>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">焦点的写法</Typography>
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
                    <b>焦点?</b>
                  </InputLabel>
                </HtmlTooltip>
                <Input
                  name="焦点"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(action["焦点"])}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">变化的写法</Typography>
                      <ol>
                        <li>100:201,300:450</li>
                        <li>0.2,0.7</li>
                      </ol>
                    </React.Fragment>
                  }
                >
                  <InputLabel>
                    <b>变化?</b>
                  </InputLabel>
                </HtmlTooltip>
                <Input
                  name="变化"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={jsUtil.convertNumbersToString(action["变化"])}
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
              <InputLabel>
                焦点: {jsUtil.convertNumbersToString(action["焦点"])}
              </InputLabel>
              <InputLabel>
                变化: {jsUtil.convertNumbersToString(action["变化"])}
              </InputLabel>
              <br></br>
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
