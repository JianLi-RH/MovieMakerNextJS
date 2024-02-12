import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbfile = "moviemaker.db";

const conn = async () => {
  const db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
  });
  return db;
};

export default {
  // 登录
  async login(username, password) {
    // 返回值是undefined的话，表示登录失败
    let db = await conn();
    const result = await db.get(
      "SELECT guid, username, password FROM users WHERE username=:username and password=:password",
      { ":username": username, ":password": password }
    );

    if (result == undefined) {
      db.close();
      return result;
    }

    const login_status = await db.get(
      "SELECT 1 FROM login_status WHERE guid=:guid",
      { ":guid": result["guid"] }
    );
    let status = undefined;
    if (login_status == undefined) {
      // 记录登录状态
      status = await db.run(
        "INSERT INTO login_status (guid, username, timestamp) values (:guid, :username, :timestamp)",
        {
          ":guid": result["guid"],
          ":username": username,
          ":timestamp": Date.now(),
        }
      );
    } else {
      // 更新登录时间
      status = await db.run(
        "UPDATE login_status SET timestamp=:timestamp WHERE guid=:guid",
        {
          ":timestamp": Date.now(),
          ":guid": result["guid"],
        }
      );
    }

    db.close();
    return result;
  },

  // 获取用户信息
  async checkUser(username) {
    const db = await conn();
    const result = await db.get(
      "SELECT guid, username FROM users where username=(?)",
      username
    );
    db.close();
    return result;
  },

    // 获取用户信息
    async checkUserByToken(token) {
      const db = await conn();
      const result = await db.get(
        "SELECT guid, username FROM users where guid=(?)",
        token
      );
      db.close();
      return result;
    },

  // 注册用户
  async registerUser(guid, username, password) {
    const db = await conn();
    const result1 = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users';"
    );
    const result = await db.run(
      "INSERT INTO users (guid, username, password) values (:guid, :username, :password)",
      { ":guid": guid, ":username": username, ":password": password }
    );
    db.close();
    return result != undefined;
  },

  // 取得用户登录信息
  async getUserLogin(request) {
    const db = await conn();
    const token = request.headers.get("authorization", "");
    if (token === "") {
      return undefined;
    }
    const result = await db.get(
      "SELECT guid, username, timestamp FROM login_status where guid=(?)",
      token
    );

    if (result == undefined) {
      return undefined;
    }

    // 登录已经超过一天需要重新登录(更新登录时间)
    if (Date.now() - result["timestamp"] > 24 * 60 * 60 * 1000) {
      db.run("DELETE FROM login_status WHERE guid=(?)", token);
      return 1;
    }
    db.close();
    return result;
  },

  // 退出登录
  async deleteLogin(request) {
    const db = await conn();
    const token = request.headers.get("authorization", "");
    const result = await db.get(
      "SELECT 1 FROM login_status where guid=(?)",
      token
    );
    if (result == undefined) {
      db.close();
      return true;
    }

    const delete_result = db.run(
      "DELETE FROM login_status WHERE guid=(?)",
      token
    );
    return delete_result != undefined;
  },
};
