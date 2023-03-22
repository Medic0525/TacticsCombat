#region Functions
def distance(start: list, end: list):
    return end[0]-start[0]+end[1]-start[1]

def is_legal_move(start: list, end: list, maxstep: int):
    if distance(start, end) <= maxstep:
        return True
    return False



def attack_counter(attacker: dict, defender: dict):
    return attacker["inborn"]["atk"]-defender["inborn"]["dfc"]

def skillselector(skill, attacker, *defender):
    defender = defender[0] if defender else 0
    match skill:
        case "attack":
            dmg = attack_counter(attacker,defender)
            defender["hp"] -= dmg
        case "magic":
            pass
#endregion

class Player:
    def __init__(self, name: str, pos: list, hp: int,
        atk: int, dfc: int, maxstep: int, buffs: dict
    ) -> None:
        self.name = name
        self.pos = pos
        self.hp = hp
        self.atk = atk
        self.dfc = dfc
        self.maxstep = maxstep
        self.buffs = buffs

class Game:
    action_order = ("determine","move", "act", "ending")

    def __init__(self, map, players) -> None:
        self.map = map
        self.players = players
        self.nowplayer_index = 0
    
    def nowplayer(self) -> Player:
        return self.players[self.nowplayer_index]

    def move(self, destination: list):
        if is_legal_move(self.nowplayer().pos, destination, self.nowplayer().maxstep):
            pass