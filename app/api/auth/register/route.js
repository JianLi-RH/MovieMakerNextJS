import fs from "fs";

import user from "@/lib/user";
import sql from "@/lib/sql";

const rootFolder = __dirname.split(".next")[0];

const yaml = require("js-yaml");

// 准备用户工作空间
const prepareWorkspace = (name, token) => {
  const workspace = `workspaces/${name}`;
  const userID = user.getWorkspaceByToken(name, token);
  const publicFolder = `public/${userID}`;
  console.log("--------------");
  // 创建工作区（python代码）
  if (!fs.existsSync(workspace)) {
    fs.mkdirSync(workspace, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return false;
      }
      console.log("Workspace created successfully!");
    });
    const sourcecode = `SourceCode/MovieMaker`;
    fs.cpSync(sourcecode, workspace, { recursive: true }, (err) => {
      return false;
    });
    fs.mkdirSync(`${workspace}/script`, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return false;
      }
      console.log("Scrit folder created successfully!");
    });
  }
  // 创建资源存储区
  if (!fs.existsSync(publicFolder)) {
    fs.mkdirSync(publicFolder, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("Public folder created successfully!");
    });
  }

  // 更新全局配置
  const config = `${workspace}/global_config.yaml`;
  const settings = yaml.load(fs.readFileSync(config, "utf-8"));
  settings.output_dir = `${rootFolder}${workspace}/output`;
  settings.sucai_dir = `${rootFolder}public`;

  const yaml_string = yaml.dump(settings);
  fs.writeFile(config, yaml_string, (err) => {
    if (err) {
      return false;
    }
  });
  return true;
};

//注册
export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("username");
  const pwd = formData.get("password");

  const check_result = await sql.checkUser(name);
  if (check_result != undefined) {
    return Response.json({
      code: 107,
      status: "fail",
      msg: "户用已存在",
    });
  }

  const token = require("crypto").randomBytes(32).toString("hex");
  const result = sql.registerUser(token, name, pwd);
  if (result) {
    if (!prepareWorkspace(name, token)) {
      return Response.json({
        code: 105,
        status: "fail",
        msg: "创建工作空间失败",
      });
    }

    return Response.json({
      code: 200,
      status: "success",
      msg: "户用注册成功",
    });
  } else {
    return Response.json({
      code: 108,
      status: "fail",
      msg: "户用注册失败",
    });
  }
}
