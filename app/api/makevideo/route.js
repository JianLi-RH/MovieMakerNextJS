import fs from "fs";
import sql from "@/lib/sql";
import userlib from "@/lib/user";

// 生成视频
export async function POST(request) {
  const user = await sql.getUserLogin(request);
  if (user == 1) {
    return Response.json({
      code: 112,
      status: "fail",
      msg: "用户登录超时",
    });
  }
  if (user == undefined) {
    return Response.json({ code: 103, status: "fail", msg: "没有用户登录" });
  }

  const username = user["username"];

  const form = await request.formData();
  const script = form.get("script");
  const scenario = form.get("scenario");

  const script_path = `script/${script}.yaml`;
  let output = `${script}.mp4`;
  if (scenario != "") {
    output = `${scenario}.mp4`;
  }
  const video = `workspaces/${username}/output/${output}`;
  const workspace = await userlib.getWorkspaceByReq(request);
  const publicFolder = `public/${workspace}`;

  const spawn = require("child_process").spawn;
  const runPath = `workspaces/${username}/run.py`; // 执行后台服务的路径
  let cmd = [runPath, "-o", output, "-s", script_path];
  if (scenario != "") {
    cmd.push("-c");
    cmd.push(scenario);
  }
  console.log("cmd: ", cmd);
  const python = spawn("python", cmd);
  python.stdout.on("data", function (response) {
    console.log(response.toString());
  });
  python.stderr.on("data", function (response) {
    console.log(response.toString());
  });

  python.on("exit", function (code) {
    console.log(
      "Python process is now completed send data as response, code: ",
      code
    );
    if (code != 0) {
      return Response.json({
        code: 501,
        status: "fail",
        msg: "生成视频失败",
      });
    }

    fs.mkdirSync(publicFolder, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        return Response.json({
          code: 502,
          status: "fail",
          msg: "无法找到视频存放目标地址",
        });
      }
    });
    fs.cpSync(
      video,
      `${publicFolder}/${output}`,
      { recursive: true },
      (err) => {
        console.log(err);
        return Response.json({
          code: 503,
          status: "fail",
          msg: "复制视频失败",
        });
      }
    );
  });

  for (var i = 0; i < 100; i++) {
    if (python.exitCode == null) {
      await delay(6000);
    } else if (python.exitCode === 0) {
      return Response.json({
        code: 200,
        status: "success",
        msg: `${workspace}/${output}`,
      });
    } else {
      return Response.json({
        code: 504,
        status: "fail",
        msg: "未知异常",
      });
    }
  }
}

function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}