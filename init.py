import sqlite3

def CreateDatabase():
    con = sqlite3.connect("moviemaker.db")
    cur = con.cursor()

    cur.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", ('users',))
    result = cur.fetchone()
    print(result)
    if not result:
        cur.execute("CREATE TABLE users (guid TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)")
        cur.execute("CREATE TABLE login_status (guid TEXT NOT NULL, username TEXT NOT NULL, timestamp INT NOT NULL)")

    con.close()

if __name__ == "__main__":
    CreateDatabase()