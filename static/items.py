from dataclasses import dataclass, field
import random



Random = random.SystemRandom()

@dataclass
class user:
    userid: int = field(init = False)
    username: str = field(init = False)
    nickname: str
    hashedpassword: int = field(init = False)
    accountmail: str
    

    def __post_init__(self, password, accountname):
        nameid = str(Random.randint(0,9999)).zfill(4)
        self.hashedpassword = hash(password)
        self.username = F"{accountname}#{nameid}"

