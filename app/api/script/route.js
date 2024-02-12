import fs from "fs";
import sql from "@/lib/sql";

const yaml = require("yaml");

// 更新脚本
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
  const body = await request.json();
  const doc = JSON.stringify(body.script, null, 4);
  const config = `workspaces/${username}/script/${body.path}.yaml`;
  fs.writeFile(config, doc, (err) => {
    if (err) {
      return Response.json({ code: 201, status: "fail", msg: err.toString() });
    }
  });
  return Response.json({ code: 200, status: "success", msg: "更新脚本成功" });
}
