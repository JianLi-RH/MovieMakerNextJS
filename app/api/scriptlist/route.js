import fs from "fs";
import sql from "@/lib/sql";

// 获取脚本列表
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
  const scriptFolder = `workspaces/${username}/script`;
  // 获取脚本列表
  const fileNames = fs.readdirSync(scriptFolder);
  let result = { code: 200, status: "success", msg: [] };
  if (fileNames.length > 0) {
    result.msg = Array(fileNames.length);
    for (var i = 0; i < fileNames.length; i++) {
      // result.msg[i] = { id: fileNames[i].replace(/\.(yaml|yml)$/, "") };
      result.msg[i] = fileNames[i].replace(/\.(yaml|yml)$/, "")
    }
  }
  return Response.json(result);
}
