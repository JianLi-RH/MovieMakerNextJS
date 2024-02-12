import { connected } from "process";

export default {
  // 上传资源文件到服务器
  // 返回:
  // {
  //   code
  //   status
  //   msg
  // }
  async uploadToServer(file, subfolder) {
    if (!sessionStorage.token) {
      return;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("subfolder", subfolder);
    let result = await fetch("/api/resource", {
      method: "POST",
      headers: { Authorization: sessionStorage.token },
      body,
    });
    return result.json();
  },
};
