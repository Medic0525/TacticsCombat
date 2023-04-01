from dataclasses import dataclass, field
import random



Random = random.SystemRandom()

@dataclass
class user:
    userid: int = field(init = False)
    username: str = field(init = False)
    profile_picture: str = field(init = False)
    nickname: str
    hashedpassword: int = field(init = False)
    accountmail: str
    

    def __post_init__(self, password, accountname):
        nameid = str(Random.randint(0,9999)).zfill(4)
        self.hashedpassword = hash(password)
        self.username = F"{accountname}#{nameid}"

@dataclass
class active_ability:
    damage: float = field(init = False)
    enchantment = dict
    healing: float = field(init = False)

    def __post_init__(self):
        pass

@dataclass
class kit:
    player_name: str
    icon: str
    hp: int
    mp: int
    attack: int
    defense: int
    enchantment: dict
    active_skill_1: active_ability
    active_skill_2: active_ability
    active_skill_3: active_ability
    active_skill_4: active_ability
    active_skill_5: active_ability


def main():
    print("item testing")

if __name__ == "__main__":
    main()
