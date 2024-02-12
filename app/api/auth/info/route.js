import sql from "@/lib/sql";

//获取用户信息
export async function GET(request) {
  const user = await sql.getUserLogin(request);
  if (user == 1) {
    return Response.json({
      code: 112,
      status: "fail",
      msg: "用户登录超时",
    });
  }
  if (user != undefined) {
    return Response.json({
      code: 200,
      status: "success",
      msg: user,
    });
  } else {
    return Response.json({ code: 103, status: "fail", msg: "没有用户登录" });
  }
}
