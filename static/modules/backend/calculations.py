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
    if skill == "attack":
        dmg = attack_counter(attacker,defender)
        defender["hp"] -= dmg
    if skill == "magic":
        pass