import fs from "fs";
import sql from "@/lib/sql";
import jsUtil from "@/lib/jsUtil";

const yaml = require("js-yaml");

// 获取脚本内容
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
  const file = request.nextUrl.searchParams.get("file");
  if (file != undefined) {
    // 获取脚本内容
    const data = fs.readFileSync(`${scriptFolder}/${file}.yaml`, {
      encoding: "utf8",
      flag: "r",
    });

    return Response.json({
      code: 200,
      status: "success",
      msg: yaml.load(data),
    });
  } else {
    return Response.json({ code: 302, status: "fail", msg: "脚本不存在" });
  }
}

// 上传脚本
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

  const form = await request.formData();
  const length = form.get("length");
  if (parseInt(length) > 2) {
    // 客户端显示已经有3个视频了
    return Response.json({
      code: 303,
      status: "fail",
      msg: "脚本数量超限",
    });
  }
  const username = user["username"];
  const scriptFolder = `workspaces/${username}/script`;
  if (!fs.existsSync(scriptFolder)) {
    fs.mkdirSync(scriptFolder, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return Response.json({
          code: 305,
          status: "fail",
          msg: "创建脚本文件夹失败",
        });
      }
      console.log("scriptFolder created successfully!");
    });
  }
  const fileNames = fs.readdirSync(scriptFolder);
  if (fileNames.length > 2) {
    return Response.json({
      code: 304,
      status: "fail",
      msg: "服务器端脚本数量超限",
    });
  }

  const src = form.get("file");
  const dest = `workspaces/${username}/script/${src["name"]}`;
  const result = await jsUtil.saveUploadedFile(src, dest);
  console.log("result: ", result);
  if (result != true) {
    return Response.json({
      code: 311,
      status: "fail",
      msg: "文件上传失败",
    });
  }

  return Response.json({
    code: 200,
    status: "success",
    msg: "文件上传成功",
  });
}

export async function DELETE(request) {
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
  const file = request.nextUrl.searchParams.get("file");
  if (file != undefined) {
    const filepath = `workspaces/${username}/script/${file}.yaml`;
    console.log("filepath: ", filepath);
    fs.unlink(filepath, (err) => {
      if (err) {
        return Response.json({
          code: 307,
          status: "fail",
          msg: "脚本删除失败",
        });
      }
    });
    return Response.json({
      code: 200,
      status: "success",
      msg: "脚本删除成功",
    });
  } else {
    return Response.json({
      code: 308,
      status: "fail",
      msg: "未知脚本错误",
    });
  }
}

// 创建新脚本
export async function PUT(request) {
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
  const file = request.nextUrl.searchParams.get("name");
  if (file != undefined) {
    const filepath = `workspaces/${username}/script/${file}.yaml`;
    if (fs.existsSync(filepath)) {
      return Response.json({
        code: 309,
        status: "fail",
        msg: "已存在同名的脚本",
      });
    } else {
      fs.writeFile(filepath, "场景:\n  -\n    名字: 新场景", (err) => {
        if (err) {
          return Response.json({
            code: 310,
            status: "fail",
            msg: "脚本创建失败",
          });
        }
      });
      return Response.json({
        code: 200,
        status: "success",
        msg: "新脚本创建成功",
      });
    }
  } else {
    return Response.json({
      code: 308,
      status: "fail",
      msg: "未知脚本错误",
    });
  }
}
