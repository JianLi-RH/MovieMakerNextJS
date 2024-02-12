import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Select, MenuItem } from "@mui/material";

import UpdateChar from "./_update";
import Display from "./_display";
import Disappear from "./_disappear";
import Camera from "./_camera";
import Turn from "./_turn";
import Walk from "./_walk";
import GIF from "./_gif";

export default function Action({ allActions, allChars, onSaveAction }) {
  const [actionType, setActionType] = React.useState("--");

  const saveAction = (id, newAct) => {
    let act = [];
    for (var i = 0; i < allActions.length; i++) {
      if (i == id) {
        act.push(newAct);
      } else {
        act.push(allActions[i]);
      }
    }
    onSaveAction(act);
  };

  const handleAddAction = () => {
    if (actionType === "--") {
      return;
    }
    let act = [];
    if (allActions != undefined) {
      act = [...allActions];
    }
    let newAct = {};
    if (actionType === "更新") {
      newAct = {
        名称: "更新",
        角色: {
          名字: "",
          素材: "",
        },
      };
    } else if (actionType === "显示") {
      newAct = {
        名称: "显示",
        角色: "",
      };
    } else if (actionType === "消失") {
      newAct = {
        名称: "消失",
        角色: "",
      };
    } else if (actionType === "镜头") {
      newAct = {
        名称: "镜头",
        焦点: "中心",
        变化: [1,1],
      };
    } else if (actionType === "行进") {
      newAct = {
        名称: "行进",
        角色: "",
        开始位置: null,
        结束位置: null,
        比例: [1, 1],
        方式: "自然",
      };
    } else if (actionType === "转身") {
      newAct = {
        名称: "转身",
        角色: "",
        度数: "左右",
      };
    } else if (actionType === "gif") {
      newAct = {
        名称: "gif",
        角色: "",
        素材: "",
        位置: "中心",
        比例: 1,
        度数: "左右",
      };
    } else {
      console.log("未知动作");
    }
    act.push(newAct);
    onSaveAction(act);
  };

  const deleteAction = (id) => {
    let act = [];
    for (var i = 0; i < allActions.length; i++) {
      if (i !== id) {
        act.push(allActions[i]);
      }
    }
    onSaveAction(act);
  };

  return (
    <Box>
      <Typography gutterBottom variant="subtitle2" component="span">
        添加动作：
      </Typography>
      <Select
        size="small"
        onChange={(event) => setActionType(event.target.value)}
        value={actionType}
        label="动作"
      >
        <MenuItem value="--">--</MenuItem>
        <MenuItem value="更新">更新</MenuItem>
        <MenuItem value="显示">显示</MenuItem>
        <MenuItem value="消失">消失</MenuItem>
        <MenuItem value="镜头">镜头</MenuItem>
        <MenuItem value="行进">行进</MenuItem>
        <MenuItem value="转身">转身</MenuItem>
        <MenuItem value="gif">gif</MenuItem>
      </Select>
      <Button onClick={() => handleAddAction()}>添加新动作</Button>
      {allActions &&
        allActions.map((action, i) => {
          const name = action["名称"];
          if (name == "更新") {
            return (
              <UpdateChar
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></UpdateChar>
            );
          } else if (name == "显示") {
            return (
              <Display
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Display>
            );
          } else if (name == "消失") {
            return (
              <Disappear
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Disappear>
            );
          } else if (name == "镜头") {
            return (
              <Camera
                key={i}
                action={action}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Camera>
            );
          } else if (name == "转身") {
            return (
              <Turn
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Turn>
            );
          } else if (name == "行进") {
            return (
              <Walk
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Walk>
            );
          } else if (name == "gif") {
            return (
              <GIF
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></GIF>
            );
          } else {
            console.log(`暂不支持该动作 ${action["名称"]}.`);
          }
        })}
    </Box>
  );
}
