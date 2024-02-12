import fs from "fs";
import sql from "@/lib/sql";
import u from "@/lib/user";
import jsUtil from "@/lib/jsUtil";

const yaml = require("yaml");

// 上传资源文件
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
  const subfolder = form.get("subfolder");
  const file = form.get("file");
  const workspace = await u.getWorkspaceByReq(request);
  const resourceFolder = `public/${workspace}/${subfolder}`;
  if (!fs.existsSync(resourceFolder)) {
    fs.mkdirSync(resourceFolder, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return Response.json({
          code: 401,
          status: "fail",
          msg: "创建资源文件夹失败",
        });
      }
      console.log("resourceFolder created successfully!");
    });
  }
  const desc = `${resourceFolder}/${file["name"]}`
  const result = await jsUtil.saveUploadedFile(file, desc);
  if (result) {
    return Response.json({
      code: 200,
      status: "success",
      msg: `${workspace}/${subfolder}/${file["name"]}`,
    });
  } else {
    return Response.json({ code: 402, status: "fail", msg: "资源文件上传失败" });
  }
}
