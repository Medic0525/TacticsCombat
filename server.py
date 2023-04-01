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

last_keys = {
    "vertical": "",
    "horizonal": ""
}
spriteposition = data["spriteposition"] #[x,y]
grids = data["grids"] #12*12, from [1,1] to [10,10]


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
        "space.grids": grids
    }

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
    variation_x = 0
    variation_y = 0

    #horizonal ------
    if (keys["a"]):
        variation_x = 1
        #print("key a") ###debug
        last_keys["horizonal"] = "a"
    elif (keys["d"]):
        variation_x = -1
        last_keys["horizonal"] = "d"
    else:
        variation_x = 0

    #vertical  |||||||
    if (keys["w"]):
        variation_y = 1
        last_keys["vertical"] = "w"
    elif (keys["s"]):
        variation_y = -1
        last_keys["vertical"] = "s"
    else:
        variation_y = 0

    spriteposition[0] += variation_x
    spriteposition[1] += variation_y
    #emit session
    socketio.emit("sprite.pos", spriteposition)

if __name__ == "__main__":
    socketio.run(app=app, host='0.0.0.0', port=81)

# render_template 只能在flask的裝飾符包裝的函數底下執行。
# eventlet 必須安裝