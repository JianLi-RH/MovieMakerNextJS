import { useEffect, useState } from "react";
import useDownloader from "react-use-downloader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { AddCircle } from "@mui/icons-material/";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import Scenario from "./MovieComponent/scenario";
import GlobalConifg from "@/lib/app.config.js";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

// 将更改保存到文件
const callAPI = async (scenarios, selectedScript) => {
  if (sessionStorage.token) {
    const cc = [];
    for (var i = 0; i < scenarios.length; i++) {
      cc.push(scenarios[i]);
    }
    const res = await fetch(`/api/script`, {
      method: "POST",
      headers: { Authorization: sessionStorage.token },
      body: JSON.stringify({
        script: { 场景: cc },
        path: selectedScript,
      }),
    });
    return await res.json();
  }
  return null;
};

const getScenarios = async (scriptName) => {
  if (sessionStorage.token) {
    const scenarios = await fetch(`/api/file?file=${scriptName}`, {
      headers: { Authorization: sessionStorage.token },
    });
    const json = await scenarios.json();
    if (json.code === 200) {
      return json.msg["场景"];
    }
  }

  return [];
};

export default function Workspace({ selectedScript }) {
  const [scenarios, setScenarios] = useState([]); // 当前脚本的全部场景
  const [downloadDisplay, setDownloadDisplay] = useState("none");
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const [url, setUrl] = useState(""); // 视频文件地址
  const [circle, setCircle] = useState("none");

  useEffect(() => {
    async function test() {
      if (selectedScript == null) {
        setScenarios([]);
      } else {
        let _scenarios = await getScenarios(selectedScript);
        for (var i = 0; i < _scenarios.length; i++) {
          _scenarios[i].id = `${i}_${Date.now()}`;
        }
        setScenarios(_scenarios);
      }
    }
    test();
  }, [selectedScript]);

  // 添加新场景
  const handleAddScenario = (e) => {
    let sc = {
      背景: "",
      名字: "default" + scenarios.length,
      焦点: "中心",
      背景音乐: null,
      比例: 1,
      角色: null,
      活动: null,
    };
    setScenarios([...scenarios, sc]);
  };

  // 删除指定顺序的场景
  const handleDeleteScenario = async (index) => {
    const newScript = [];
    for (var i = 0; i < scenarios.length; i++) {
      if (i != index) {
        newScript.push(scenarios[i]);
      }
    }
    const res = await callAPI(newScript, selectedScript);
    if (res.code === 200) {
      setScenarios(newScript);
    }
  };

  // 更新scenario状态
  const handleUpdateScenario = async (index, key, value, save = true) => {
    let scenario = { ...scenarios[index] };
    scenario[key] = value;
    scenario["id"] = Date.now();

    let newscenarios = [];
    for (var i = 0; i < scenarios.length; i++) {
      if (i === index) {
        newscenarios.push(scenario);
      } else {
        newscenarios.push({ ...scenarios[index] });
      }
    }
    if (save) {
      callAPI(newscenarios, selectedScript);
    }
    setScenarios(newscenarios);
  };

  const makeVideo = async (scenario) => {
    if (sessionStorage.token) {
      setDownloadDisplay("none");
      setCircle("inline-block");
      const body = new FormData();
      body.append("script", selectedScript);
      body.append("scenario", scenario || "");
      let res = await fetch("api/makevideo", {
        method: "POST",
        body,
        headers: { Authorization: sessionStorage.token },
      });
      const data = await res.json();
      if (data.code === 200) {
        setDownloadDisplay("inline");
        setUrl(data.msg);
      } else {
        setDownloadDisplay("none");
      }
      setCircle("none");
    }
  };
  return (
    <Box
      component="div"
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        ml: `${DRAWER_WIDTH}px`,
        mt: ["48px", "56px", "64px"],
        p: 3,
      }}
    >
      {selectedScript && (
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
          }}
          component="div"
        >
          {selectedScript}
        </Typography>
      )}
      {scenarios.length > 0 && (
        <Box>
          <Button
            onClick={() => {
              makeVideo();
            }}
          >
            生成视频
          </Button>
          <CircularProgress size="1rem" sx={{ m: 1, display: circle }} />
          <Button
            sx={{ display: downloadDisplay }}
            onClick={() => {
              download(url, `${selectedScript}.mp4`);
            }}
          >
            下载视频
          </Button>
        </Box>
      )}
      {scenarios.length > 0 &&
        scenarios.map((scenario, i) => (
          <Scenario
            key={i}
            selectedScript={selectedScript}
            scenario={scenario}
            onDeleteScenario={() => handleDeleteScenario(i)}
            onSaveScenario={() => callAPI(scenarios, selectedScript)}
            onUpdateScenario={(key, value, save = true) =>
              handleUpdateScenario(i, key, value, save)
            }
          ></Scenario>
        ))}
      {/* 只有选中了脚本的时候才出现添加场景按钮 */}
      {selectedScript && (
        <Box
          sx={{
            width: 1,
            marginRight: 0.5,
            my: 1,
          }}
        >
          <List>
            <ListItemButton onClick={() => handleAddScenario()}>
              <ListItemText sx={{ textAlign: "center" }}>
                <AddCircle></AddCircle>
              </ListItemText>
            </ListItemButton>
          </List>
        </Box>
      )}
    </Box>
  );
}
