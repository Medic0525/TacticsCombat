# coding: utf-8
from flask import Flask, render_template
from flask_socketio import SocketIO
import configs
import json

app = Flask(__name__)
app.config.from_object(configs)
socketio = SocketIO(app)

with open("static/stages/stage1.json") as f:
    data = json.load(f)

sprites_data = data["sprites"]

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/begin/')
def begin():
    return render_template("a.html")

@app.route('/stage1')
def get_data():
    return {**data}

@socketio.on('connect')
def connect():
    print("Client connected")

@socketio.on("disconnect")
def disconnect():
    print("Client disconnected")

def move_process (request):
    sprites_data[request["index"]]["gridpos"] = request["position"]

@socketio.on("move_request")
def move_request(request):
    print("received:",request)
    move_process(request)
    socketio.emit("sprites_data_update", sprites_data)
    

'''
@socketio.on("key")
def spritemove(keys, **somethingthatshouldnotexist):
    variation_x = 0
    variation_y = 0

    #horizonal ------
    if (keys["a"]):
        variation_x = -1
        #print("key a") ###debug
        last_keys["horizonal"] = "a"
    elif (keys["d"]):
        variation_x = 1
        last_keys["horizonal"] = "d"
    else:
        variation_x = 0

    #vertical  |||||||
    if (keys["w"]):
        variation_y = -1
        last_keys["vertical"] = "w"
    elif (keys["s"]):
        variation_y = 1
        last_keys["vertical"] = "s"
    else:
        variation_y = 0

    spriteposition[0] += variation_x
    spriteposition[1] += variation_y
    #emit session
'''

if __name__ == "__main__":
    socketio.run(app=app, host='0.0.0.0', port=80)

# render_template 只能在flask的裝飾符包裝的函數底下執行。
# eventlet 必須安裝