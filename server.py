from flask import Flask, render_template
from flask_socketio import SocketIO
import configs

app = Flask(__name__)
app.config.from_object(configs)

socketio = SocketIO(app)

@app.route('/')
def index():
    ctx = render_template("index.html")
    return ctx

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

lastKey= {
    "vertical": "",
    "horizonal": ""
}

spriteposition = [400, 300]

@socketio.on("key")
def spritemove(keys, **somethingthatshouldnotexist):
    toEmit = [0, 0]

    #horizonal ------
    if (keys["a"]):
        toEmit[0] = 1
        print("key a") ###debug
        lastKey["horizonal"] = "a"
    elif (keys["d"]):
        toEmit[0] = -1
        lastKey["horizonal"] = "d"
    else:
        toEmit[0] = 0

    #vertical  |||||||
    if (keys["w"]):
        toEmit[1] = 1
        lastKey["vertical"] = "w"
    elif (keys["s"]):
        toEmit[1] = -1
        lastKey["vertical"] = "s"
    else:
        toEmit[1] = 0

    spriteposition[0] += toEmit[0]
    spriteposition[1] += toEmit[1]
    #emit session
    socketio.emit("spritemove", spriteposition)




if __name__ == "__main__":
    socketio.run(app=app, host='0.0.0.0', port=81)

# render_template 只能在flask的裝飾符包裝的函數底下執行。
# eventlet 必須安裝