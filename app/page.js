"use client";

import RootLayout from "./layout";

import * as React from "react";
import { useEffect, useState } from "react";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Workspace from "@/components/workspace.js";
import FullFeaturedCrudGrid from "@/components/grid.js";

export default function Page() {
  const [allScriptNames, setAllScriptNames] = useState([]); //全部脚本名
  const [showSetting, setShowSetting] = useState(false);
  const [settings, setSettings] = useState({});

  const [selectedScript, setSelectedScript] = useState(null); // 当前脚本名字

  //更新脚本列表
  const updateMenuList = () => {
    if (sessionStorage.token) {
      fetch("/api/scriptlist", {
        headers: { Authorization: sessionStorage.token },
      })
        .then((r) => r.json())
        .then((r) => {
          // save data from fetch request to state
          if (r.msg instanceof Array) {
            setAllScriptNames(r.msg);
          } else {
            setAllScriptNames([]);
          }
          setSelectedScript(null);
        });
    }
  };

  //设置用户配置信息
  const showSettingDialog = async () => {
    if (sessionStorage.token) {
      let res = await fetch("/api/settings", {
        headers: { Authorization: sessionStorage.token },
      });
      const data = await res.json();
      if (data.code === 200) {
        let settings = []; //全部配置
        let i = 0; // id
        for (const [key, value] of Object.entries(data.msg)) {
          if (key != undefined) {
            settings.push({
              id: i++,
              key: key,
              value: value,
            });
          }
        }
        setSettings(settings);
        setShowSetting(true);
      }
    }
  };
  //保存用户配置的变更
  const saveSetting = (row) => {
    const body = new FormData();
    body.append("key", row.key);
    body.append("value", row.value);
    if (sessionStorage.token) {
      fetch("/api/settings", {
        method: "POST",
        body,
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.msg);
        });
    }
  };

  // 打开页面时展示菜单列表
  useEffect(() => {
    if (sessionStorage.token) {
      updateMenuList();
    }
  }, []);

  return (
    <RootLayout
      scripts={allScriptNames}
      onSelectScript={(scriptName) => {
        if (selectedScript != scriptName) {
          setSelectedScript(scriptName);
        }
      }}
      updateMenuList={() => updateMenuList()}
      showSettingDialog={() => showSettingDialog()}
    >
      <Dialog
        sx={{
          "& .MuiDialog-paper": { width: 600, maxWidth: 600, maxHeight: 600 },
        }}
        maxWidth="xs"
        open={showSetting}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>设置视频基本参数</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setShowSetting(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <FullFeaturedCrudGrid
            columns={[
              {
                field: "key",
                headerName: "参数",
                width: 150,
                color: "#FFF",
                editable: false,
              },
              {
                field: "value",
                headerName: "参数值",
                width: 150,
                align: "left",
                headerAlign: "left",
                editable: true,
              },
            ]}
            data={settings}
            onSave={(index, row) => saveSetting(row)}
            enableEdit={true}
          ></FullFeaturedCrudGrid>
        </DialogContent>
      </Dialog>
      <Workspace selectedScript={selectedScript}></Workspace>
    </RootLayout>
  );
}
