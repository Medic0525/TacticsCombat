from functools import partial

player1 = {
    "name": "p1",
    "pos": [0,0],
    "hp": 1000,
    "inborn": {
        
        "atk": 70,
        "dfc": 50,
        "maxstep": 2
    },
    "buffs": {
        "atk_enhanced": 0,
        "dmg_decreased": 0
    }
}

player2 = {
    "name": "p2",
    "pos": [0,0],
    "hp": 1000,
    "inborn": {
        
        "atk": 70,
        "dfc": 50,
        "maxstep": 15
    },
    "buffs": {
        "atk_enhanced": 0,
        "dmg_decreased": 0
    }
}

data = {
    "map": [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    "players": [player1, player2],
    "upcoming_action": "move",
    "prev_action": "buff_checking",
    "upcoming_player": player1
}

action_order = ("determine","move", "act", "ending")

def deep_copy(ref):
    new = {}
    for key in ref:
        new[key] = ref[key]
    return new

def qd(x):
    return x*x

def next(dalist: list, index: int, steps=1): #returns the value
    return dalist[(index+steps)%len(dalist)]

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

def game(data, kwargs):
    #print(data)
    data = deep_copy(data)
    #print(data)
    upcoming_action = data["upcoming_action"]
    match upcoming_action:
        case "move":
            print(kwargs)
            if is_legal_move(data["upcoming_player"]["pos"], kwargs["moveto"], data["upcoming_player"]["inborn"]["maxstep"]):
                data["upcoming_player"]["pos"] = kwargs["moveto"]
            else:
                assert False, "out_of_reach"

        case "act":
            match kwargs["skill"]:
                case "attack":
                    try:
                        defender = kwargs["target"]
                    except:
                        raise Exception("Required arg not found (in case 'attack')")
        case _: #default
            pass
    
    i = action_order.index(data["upcoming_action"])+1        
    if i < len(action_order):
        data["upcoming_action"] = action_order[i]
        return data
    data["upcoming_player"] = data["players"][data["players"].index(data["upcoming_player"])+1]
        
def main():
    game = partial(game, data)
    kwargs = {"moveto": [2,2]}
    autostop_count = 0
    while True:
        autostop_count += 1
        if autostop_count >= 10:
            break

        try:
            game_data = game(kwargs)
        except AssertionError as msg:
            print(msg)
            match msg.__str__():
                case "out_of_reach":
                    print("Too far away! Try again.")
                case _:
                    raise Exception("There's still some problems")
            continue

        match game_data["upcoming_action"]:
            case "move":
                kwargs["moveto"] = [int(s) for s in input("where to move? > ").split(",")]
            case _:
                pass
        break

if __name__ == "__main__":
    main()