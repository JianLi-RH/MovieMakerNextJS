import user from "@/lib/user";
import sql from "@/lib/sql";

//登录
export async function POST(request) {
  const username = await sql.getUserLogin(request);
  if (username != undefined) {
    return Response.json({
      code: 104,
      status: "success",
      msg: "用户已经登录，无需重复登录",
    });
  }

  const formData = await request.formData();
  const name = formData.get("username");
  const pwd = formData.get("password");

  const exists = await sql.checkUser(name);
  if (exists == undefined) {
    return Response.json({
      code: 110,
      status: "fail",
      msg: "用户不存在",
    });
  }

  const result = await sql.login(name, pwd);
  if (result != undefined) {
    return Response.json({
      code: 200,
      status: "success",
      msg: "登录成功",
      token: result.guid,
    });
  } else {
    return Response.json({
      code: 106,
      status: "fail",
      msg: "登录失败",
    });
  }
}
