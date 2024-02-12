import sql from "@/lib/sql";

//登出
export async function GET(request) {
  const logon = await sql.getUserLogin(request);
  if (logon == undefined) {
    return Response.json({ code: 109, status: "fail", msg: "用户没有登录" });
  }
  const result = await sql.deleteLogin(request);
  if (result) {
    return Response.json({ code: 200, status: "success", msg: "用户已登出" });
  } else {
    return Response.json({ code: 111, status: "success", msg: "退出失败" });
  }
}