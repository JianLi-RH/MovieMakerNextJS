import fs from "fs";
import YAML from "yaml";
import sql from "@/lib/sql";

// 获取配置信息
export async function GET(request) {
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
  const config = `workspaces/${username}/config.yaml`;
  const data = fs.readFileSync(config, {
    encoding: "utf8",
    flag: "r",
  });
  if (data == undefined || data == null) {
    return Response.json({
      code: 601,
      status: "fail",
      msg: "读取配置文件失败",
    });
  }
  return Response.json({
    code: 200,
    status: "success",
    msg: YAML.parse(data),
  });
}

// 保存配置
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
  const config = `workspaces/${username}/config.yaml`;

  let data = fs.readFileSync(config, {
    encoding: "utf8",
    flag: "r",
  });
  if (data == undefined || data == null) {
    return Response.json({
      code: 601,
      status: "fail",
      msg: "读取配置文件失败",
    });
  }

  const form = await request.formData();
  const key = form.get("key");
  const value = form.get("value");

  let jdoc = YAML.parse(data);
  jdoc[key] = value;
  // save to file
  const yaml = require("js-yaml");
  fs.writeFile(config, yaml.dump(jdoc), (err) => {
    if (err) {
      return Response.json({
        code: 602,
        status: "fail",
        msg: "保存配置信息失败",
      });
    }
  });
  return Response.json({ code: 200, status: "success", msg: "更新成功" });
}
