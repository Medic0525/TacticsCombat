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
const GRIDSAMOUNT_X = data["space.grids"].length;
const GRIDSAMOUNT_Y = data["space.grids"][0].length;
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


class ProtoSpace extends Element {
    tileDict = {0: "green",1: "black"};
    constructor (gridsCtx) {
        super([0,0], [TILESIZE*GRIDSAMOUNT_X, TILESIZE*GRIDSAMOUNT_X]);
        this.gridsCtx = gridsCtx;
        this.posX = 0;
        this.posY = 0;
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
            ctx.beginPath();
            ctx.moveTo(1,1);
            ctx.lineTo(CANVASWIDTH-1,1)
            ctx.lineTo(CANVASWIDTH-1,CANVASHEIGHT-1)
            ctx.lineTo(1,CANVASHEIGHT-1)
            ctx.lineTo(1,1)
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            ctx.closePath();
        }
    }
}

player0 = new Player([10,20]);
player0.setPos(data["sprite.pos"]);
player1 = new Player([50,50]);
space = new ProtoSpace(data["space.grids"]);
playerList = [player0, player1];
divisionList = [space];
elementList = () => [].concat(playerList, divisionList);
keystatus = {
    "d": false, 'a': false, "w": false, 's': false
}

deepCopyOf = (arr) => {
    let newarr = [];
    for (let item of arr) newarr.push(item)
    return newarr
}
isInAnyonesField = (list,x,y) => {
    for (let e of list) if (e.isInField(x, y)) return e;
}
itemPoped = (arr, item) => {
    let others = deepCopyOf (arr);
    let index = arr.indexOf(item);
    if (index===-1) throw new Error("At canvas.oncick: why isn't the player there?")
    others.splice(index,1);
    return others
}


$(function () {
    var socket = io.connect(); 
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext('2d');
    var elementLastClicked = undefined

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
            if (isInAnyonesField(elementList(), event.offsetX, event.offsetY) === space){
                space.dragged = true;
                space.draggingX = event.offsetX;
                console.log("at mousedown event: offset Y", event.offsetY);
                space.draggingY = event.offsetY
            }
        })
        $(canvas).mousemove(function (event) {
            if (space.dragged) space.drag(event.offsetX,event.offsetY)
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
        socket.on("space.grids", function (grids) {
            space.gridsCtx = grids; //[[]]
        });
        socket.on("space.relativePos", function (relativePos){
            space.relativePos = relativePos; // []
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
                space.setPos([0,0])
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