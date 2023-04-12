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

        self.password = hash(password)

        self.account_mail = account_mail
        
        cur.execute(F"INSERT INTO user VALUES('{self.userid}', '{self.profile_name}', '{self.username}', '{self.profile_picture}', '{self.nickname}', '{self.password}', '{self.account_mail}')")
        con.commit()

    def login(account_mail, password):
        log_password = con.execute(F"SELECT password FROM user WHERE profile_name='{account_mail}', CASE WHEN password IS NULL THEN 0 ELSE password")
        if password == log_password:
            return True
        else:
            return False



"""
class Position:
    def __init__(self, x, y):
        self.x = x
        self.y =y

class Player:
    def __init__(self, icon: str, hp: int, mp: int, attack: int, defense: int, movement: int, pos: Position, enchantment: dict = dict(),  skills: list = list()):
        self.icon = icon
        self.hp = hp
        self.mp = mp
        self.attack = attack
        self.defense = defense
        self.movement = movement

        def get_pos():
            return self.pos

        def set_pos(self, x, y):
            self.pos.x = x
            self.pos.y = y

        def move(self, new_pos):
            x = new_pos.x - self.pos.x
            y = new_pos.y - self.pos.y

            if x+y > movement:
                return False
            else:
                return (x,y)    
"""    




def main():

    testing_user = User(username = "Medic0525", password = 123, account_mail = "minstrike520@gmail.com")
    test = cur.execute("SELECT * FROM user WHERE profile_name='Medic0525'")
    con.commit()
    print(test.fetchone())
    cur.execute("DELETE FROM user WHERE profile_name='Medic0525'")
    con.commit()
    print("register system testing")

if __name__ == "__main__":
    main()
