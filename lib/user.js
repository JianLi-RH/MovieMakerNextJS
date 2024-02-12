import sql from "@/lib/sql";

export default {
  async getWorkspaceByReq(request) {
    const token = request.headers.get("authorization", "");
    const user = await sql.checkUserByToken(token);
    return `${user["username"]}_${token.substr(0, 10)}`;
  },

  getWorkspaceByToken(name, token) {
    return `${name}_${token.substr(0, 10)}`;
  },
};
