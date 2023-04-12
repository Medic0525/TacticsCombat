import random
import sqlite3
import json

Random = random.SystemRandom()
con = sqlite3.connect("static\database\combat.db")
cur = con.cursor()

cur.execute("CREATE TABLE IF NOT EXISTS user(user_id INT, profile_name VARCHAR, username VARCHAR, profile_picture VARCHAR, nickname VARCHAR(20), password VARCHAR, account_mail VARCHAR)")

with open("static\database\settings.json") as j:
    file = json.load(j)


class User:
    def __init__(self, username: str,  password: str, account_mail: str, profile_picture=None, nickname=None):
        
        nameid = str(Random.randint(0,9999)).zfill(4)
        self.profile_name = username
        self.username = F"{username}#{nameid}"

        self.profile_picture = profile_picture

        self.nickname = nickname if nickname != None else username

        self.userid = str(file["player_count"]).zfill(9)
        self.userid = int(self.userid)
        file["player_count"] += 1
        json.dumps(file)

        self.password = int(hash(password))

        self.account_mail = account_mail
        
        cur.execute(F"INSERT INTO user VALUES('{self.userid}', '{self.profile_name}', '{self.username}', '{self.profile_picture}', '{self.nickname}', '{self.password}', '{self.account_mail}')")
        con.commit()

    def login(self, account_mail, password):
        log_password = con.execute(F"SELECT password FROM user WHERE account_mail='{account_mail}'").fetchone()
        print(log_password[0])
        print(int(hash(password)))
        if log_password is not None and int(hash(password)) is log_password[0]:
            return True
        else:
            return False


def main():

    testing_user = User(username = "Medic0525", password = "123", account_mail = "minstrike520@gmail.com")
    test = cur.execute("SELECT * FROM user WHERE profile_name='Medic0525'")
    con.commit()
    print(test.fetchone())
    username = input("input email")
    password = input("input password")
    print(testing_user.login(username, password))
    cur.execute("DELETE FROM user WHERE profile_name='Medic0525'")
    con.commit()
    print("register system testing")

if __name__ == "__main__":
    main()
