# coding: utf-8
from flask import Flask, render_template
from flask_socketio import SocketIO
import configs
import json

app = Flask(__name__)
app.config.from_object(configs)
socketio = SocketIO(app)

with open("static/staticdata.json") as f:
    data = json.load(f)

last_keys = data["last_keys"] 
spriteposition = data["spriteposition"] #[x,y]
grids = data["grids"] #12*12, from [1,1] to [10,10]
relative_pos = [0,0]

#============================
#region Routes
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/begin/')
def begin():
    return render_template("a.html")

@app.route('/data')
def get_data():
    return {
        "sprite.pos": spriteposition,
        "space.grids": grids,
        "space.relativePos": relative_pos
    }

@socketio.on('send')
def chat(data):
    socketio.emit('get', data)

@socketio.on('test')
def test():
    socketio.send("test")

@socketio.on('connect')
def connect():
    print("Client connected")

@socketio.on("disconnect")
def disconnect():
    print("Client disconnected")
#endregion
#============================

@socketio.on("key")
def spritemove(keys, **somethingthatshouldnotexist):
    toEmit = [0, 0]

    #horizonal ------
    if (keys["a"]):
        toEmit[0] = 1
        #print("key a") ###debug
        last_keys["horizonal"] = "a"
    elif (keys["d"]):
        toEmit[0] = -1
        last_keys["horizonal"] = "d"
    else:
        toEmit[0] = 0

    #vertical  |||||||
    if (keys["w"]):
        toEmit[1] = 1
        last_keys["vertical"] = "w"
    elif (keys["s"]):
        toEmit[1] = -1
        last_keys["vertical"] = "s"
    else:
        toEmit[1] = 0

    spriteposition[0] += toEmit[0]
    spriteposition[1] += toEmit[1]
    #emit session
    socketio.emit("sprite.pos", spriteposition)

if __name__ == "__main__":
    socketio.run(app=app, host='0.0.0.0', port=81)

# render_template 只能在flask的裝飾符包裝的函數底下執行。
# eventlet 必須安裝