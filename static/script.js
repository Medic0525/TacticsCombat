const url = "http://localhost:81/";

let data;

$.ajaxSetup({async: false});
$.get(url+"/data", function(datax){
    console.log("Received data:",datax)
    data = datax;
});

const TILESIZE = 50;
const CANVASWIDTH = 600;
const CANVASHEIGHT = 600;
const GRIDSAMOUNT_X = data["grids"].length;
const GRIDSAMOUNT_Y = data["grids"][0].length;
const TILEDICT = data["tiledict"]
/*
const player0 = {
    pos: data["sprite.pos"],
    draw: function (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.pos[0], this.pos[1], 50, 50);
    },
    isInSprite: function (x,y) {
        if (x === this.pos[0] && y === this.pos[1]){
            return true
        }
        return false
    }
}
*/
class Element {
    constructor (pos, size) {
        this.posX = pos[0],
        this.posY = pos[1],
        this.sizeX = size[0],
        this.sizeY = size[1],
        this.selected = false
        this.dragged = false
        this.draggingX = undefined;
        this.draggingY = undefined;
    }
    isInField (x, y) {
        if (this.posX < x && x < this.posX+this.sizeX && this.posY < y && y < this.posY+this.sizeY){
            return true
        }
        return false
    }
    setPos(a,b) {
        if (b) {
            this.posX = a;
            this.posY = b;
            return;
        }
        this.posX = a[0];
        this.posY = a[1];
    }
    drag(x,y) {
        this.setPos(x-this.draggingX,y-this.draggingY)
    }
    // abstract
    draw () {
        throw new Error("wtf hell man u haven't implemented draw() yet!")
    }
}
class Player extends Element {
    constructor (pos) {
        super(pos, [50,50]);
    }
    draw (ctx) {
        ctx.fillStyle = "red";
        if (this.selected) ctx.fillStyle = "blue";
        ctx.fillRect(this.posX, this.posY, 50, 50);
    }
    update (ctx) {
        this.draw(ctx)
    }
}
class BackGround extends Element {
    tileDict = {0: "green",1: "black", 2: "yellow"};
    constructor (gridsCtx) {
        super([0,0], [TILESIZE*GRIDSAMOUNT_X, TILESIZE*GRIDSAMOUNT_X]);
        this.gridsCtx = gridsCtx;
        this.posX = -5*TILESIZE;
        this.posY = -5*TILESIZE;
    }
    draw (ctx) {
        let gridY = 0;
        for (let grid_line of this.gridsCtx) {
            let gridX = 0;
            for (let grid of grid_line) {
                //console.log("gridP:", this.pos[0], gridX, this.sideLength);
                ctx.fillStyle = this.tileDict[grid];
                ctx.fillRect(
                    this.posX + gridX*TILESIZE,
                    this.posY + gridY*TILESIZE,
                    TILESIZE,
                    TILESIZE)
                gridX += 1;
            }
            gridY += 1;
        }
    }
    update (ctx) {
        this.draw(ctx);
        if (this.selected) {
            const X1 = this.posX+1;
            const X2 = this.posX+CANVASWIDTH-1;
            const Y1 = this.posY+1;
            const Y2 = this.posY+CANVASHEIGHT-1;
            ctx.beginPath();
            ctx.moveTo(X1,Y1);
            ctx.lineTo(X1,Y2);
            ctx.lineTo(X2,Y2);
            ctx.lineTo(X2,Y1);
            ctx.lineTo(X1,Y1);
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            ctx.closePath();
        }
    }
}
/* 1932
affected variables:[
    _player0 -> stage.players[0]
    _player1 -> stage.players[1]
    _space -> stage.background,
    _playerList,
    _divisionList,
    _elementList,
    _isInAnyonesField

]
    
*/
/*
const player0 = new Player([10,20]);
player0.setPos(data["sprite.pos"]);
const player1 = new Player([50,50]);
let playerList = [player0, player1];
let divisionList = [background];
elementList = () => [].concat(playerList, divisionList);
*/

deepCopyOf = (arr) => {
    let newarr = [];
    for (let item of arr) newarr.push(item)
    return newarr
}

itemPoped = (arr, item) => {
    let others = deepCopyOf (arr);
    let index = arr.indexOf(item);
    if (index===-1) throw new Error("why isn't the item you're looking for there?")
    others.splice(index,1);
    return others
}

const stage = {
    background: new BackGround(data["grids"]),
    posX: this.background.posX,
    posY: this.background.posY,

    players: [],
    elements: [].concat(this.players,[this.background]),

    getRelativePos: (element) => {
        return [
            element.posX-this.posX, 
            element.poxY-this.posY
        ]
    },
    isInAnyonesField: (x,y) => {
        for (let e of elements) if (e.isInField(x, y)) return e;
    },
    elementsUpdate: () => {
        this.elements = this.players.concat([this.background])
    },
    appendPlayer: (newPlayer) => {
        this.players.push(newPlayer);
        this.elementsUpdate()
    }
}
stage.appendPlayer(new Player([10,20]));
stage.appendPlayer(new Player([50,50]));
stage.players[0].setPos(data["sprite.pos"]);




$(function () {
    var socket = io.connect(); 
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext('2d');
    var elementLastClicked = undefined;
    let keystatus = {
        "d": false, 'a': false, "w": false, 's': false
    }

    canvas.width = CANVASWIDTH;
    canvas.height = CANVASHEIGHT;

    listener = () => {
        $(canvas).click(function(event){
            let elements = elementList();
            e = isInAnyonesField(elements, event.offsetX, event.offsetY)
            if (e) {
                e.selected = true;
                elementLastClicked = e;
                notCilcked = itemPoped(elements, e);
            }
            else notCilcked = elements;
            for (element of notCilcked) element.selected = false
        })
    
        $(canvas).mousedown(function (event) {
            //1740. now doing: make it possible to only trigger log when mousedown is not on player
            if (isInAnyonesField(elementList(), event.offsetX, event.offsetY) === background){
                background.dragged = true;
                background.draggingX = event.offsetX-background.posX;
                background.draggingY = event.offsetY-background.posY
            }
        })
        $(canvas).mousemove(function (event) {
            if (background.dragged) background.drag(event.offsetX,event.offsetY)
        })

        $(canvas).mouseup(function (event) {
            //1740. now doing: make it possible to only trigger log when mousedown is not on player
            for (element of elementList()){
                element.dragged = false;
                element.draggingX = undefined;
                element.draggingY = undefined;
            }
        })
    }
    listener();
    

    dataUpdate = () => {
        socket.on("sprite.pos", function (spriteposition) {
            player0.setPos (spriteposition); //[]
        });
        socket.on("background.grids", function (grids) {
            background.gridsCtx = grids; //[[]]
        });
    }
    dataUpdate();
    
    drawAll = (list,ctx) => {
        for (let reversedIndex in list) {
            let element = list[list.length-reversedIndex-1]
            element.draw(ctx)
        }
    }

    drawAll(elementList(), ctx)

    /*
    const motivation = {
        X: 0,
        Y: 0
    }

    function keypressing(){
        if (keys["d"] && lastKey === 'd'){
            motivation.X = 1;
        } else if (keys["a"] && lastKey === 'a'){
            motivation.X = -1;
        } else {
            motivation.X = 0;
        }
        
        if (keys["w"] && lastKey === 'w'){
            motivation.Y = 1;
        } else if (keys["s"] && lastKey === 'a'){
            motivation.Y = -1;
        } else {
            motivation.Y = 0;
        }
    }
    */
    animate = () => {
        window.requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        socket.emit("key", keystatus);
        drawAll(elementList(), ctx)
        
        //console.log(spriteposition);
    }
    animate();
    
    keyListener= () => {
        let keys = ["w", "a", "s", "d"];
        window.addEventListener('keypress', (event) => {
            if (event.key === 'c') {
                background.setPos([0,0])
            } 
        })


        window.addEventListener('keydown', (event) => {
            keystatus[event.key] = true;
            lastKey = event.key;
            //console.log(event.key, "keydown");
        })
        window.addEventListener('keyup', (event) => {
            keystatus[event.key] = false;
            lastKey = event.key;
            //console.log(event.key, "keyup");
        })    
    }
    keyListener();
})