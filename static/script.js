const url = "http://localhost:80/";

 let data = { //default config
    "grids": [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    "sprites": [
        {
            "gridpos": [2,3]
        },
        {
            "gridpos": [5,5]
        }
    ],
    "tiledict": [
        "green",
        "black",
        "yellow",
        "purple"
    ]
};

$.ajaxSetup({async: false});

let request = $.get(url+"/stage1");
request.done(function(result){
    console.log("Received data:",result)
    data = result;
})
request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR, textStatus, errorThrown)

})



const TILESIZE = 50;
const CANVASWIDTH = 600;
const CANVASHEIGHT = 600;
const GRIDSAMOUNT_X = data["grids"].length;
const GRIDSAMOUNT_Y = data["grids"][0].length;
const BACKGROUND_INITIAL_GRID_POS = [-5,-5];
const TILEDICT = data["tiledict"];
let clientControllingSpriteIndex = 0;


class Element {
    constructor (gridPos, size, container, layer) {
        this.container = container;
        this.gridPosX = gridPos[0];
        this.gridPosY = gridPos[1];
        this.posX = this.gridPosX*TILESIZE;
        this.posY = this.gridPosY*TILESIZE;
        this.sizeX = size[0];
        this.sizeY = size[1];
        this.selected = false;
        this.dragged = false;
        this.draggingX = undefined;
        this.draggingY = undefined
        this.layer = layer; //尚未實裝
    }
    get pos() {return [this.posX, this.posY]};

    set pos (pos) {
        this.posX = pos[0];
        this.posY = pos[1]
    };
    
    get gridPos() {return [this.gridPosX, this.gridPosY]}
    // set gridPos(arg) {throw Error("gridPos is now unable to be modified straightly. Try emitting request to the server.")}
    set gridPos(gridPos) {
        if (!this.container) throw new Error("There's no container in",this,"but you're trying to set gridPos.")
        this.gridPosX = gridPos[0];
        this.gridPosY = gridPos[1];
        this.posX = this.container.posX + this.gridPosX*TILESIZE;
        this.posY = this.container.posY + this.gridPosY*TILESIZE;
    }
    get size() {return [this.sizeX, this.sizeY]};
    get dragging() {return [this.dragging[0], this.dragging[1]]};
    get bottomRightX() {return this.posX+this.sizeX}
    get bottomRightY() {return this.posY+this.sizeY}
    touch (x,y) {
        this.draggingX = x-this.posX;
        this.draggingY = y-this.posY;
        this.dragged = true;
    }
    release () {
        if (!this.dragged) return;
        this.draggingX = undefined;
        this.draggingY = undefined;
        this.dragged = false;
    }
    isContaining (x, y) {
        if (this.posX < x && x < this.posX+this.sizeX && this.posY < y && y < this.posY+this.sizeY){
            return true
        }
        return false
    }
    set posVariation([x,y]) {
        this.posX+= x;
        this.posY+= y;
    }
    /*
    setGridPosVariation(x,y) { // deprecated method
        this.gridPosX+= x;
        this.gridPosY+= y;
        return;
    }*/
    getPosRelativeTo (element) { // 自己相對於element的位置
        return [
            this.posX-element.posX,
            this.posY-element.posY
        ]
    }
    getGridPosRelativeTo (element) {
        return [
            this.gridPosX-element.gridPosX,
            this.gridPosX-element.gridPosX
        ]
    }
    setRelativePos (element, relPos) {
        this.posX = element.posX+relPos[0];
        this.posY = element.posY+relPos[1];
    }
    /*
    setRelativeGridPos (element, relGridPos) {
        this.gridPosX = element.gridPosX+relGridPos[0];
        this.gridPosY = element.gridPosX+relGridPos[1];
    }*/
    drag(x,y) {
        if (!this.draggable) return;
        this.pos = [x-this.draggingX,y-this.draggingY];
    }
    // abstract
    draw () {
        throw new Error("wtf hell man u haven't implemented draw() yet!")
    }
}
class Player extends Element {
    constructor (spriteData,container) {
        super(
            spriteData["gridpos"], 
            [50,50],
            container,
            undefined
        );
        this.selected = undefined;
        this.moving = false;
    }
    toggleMoving () {
        if (this.moving) {
            this.moving = false; 
        }    
        else {
            this.moving = true; 
        }
    }
    get selected () {
        return this._selected
    }
    set selected (bool) {
        if (bool) this.toggleMoving();
        else this.moving = false;
        this._selected = bool;
    }
    draw (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.posX, this.posY, 50, 50);
    }
    update (ctx) {
        this.draw(ctx);
        if (this.selected) {
            if (this.moving) ctx.fillStyle = "cyan";
            else ctx.fillStyle = "blue";
            ctx.fillRect(this.posX, this.posY, 50, 50);
        } 
    }
}
class BackGround extends Element {
    tileDict = {0: "green",1: "black", 2: "yellow"};
    constructor (gridsCtx,container) {
        super(
            BACKGROUND_INITIAL_GRID_POS, 
            [TILESIZE*GRIDSAMOUNT_X, TILESIZE*GRIDSAMOUNT_Y],
            container,
            undefined
        );
        this.gridsCtx = gridsCtx;
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
            ctx.fillStyle = "purple";
            ctx.fillRect(this.posX,this.posY, 70,70)
            const X1 = this.posX+1;
            const X2 = this.posX+this.sizeX-1;
            const Y1 = this.posY+1;
            const Y2 = this.posY+this.sizeY-1;
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

class Stage extends Element{
    constructor (gridsData) {
        super(
            BACKGROUND_INITIAL_GRID_POS, 
            [TILESIZE*GRIDSAMOUNT_X, TILESIZE*GRIDSAMOUNT_Y],
            undefined,
            undefined
        );
        this.background = new BackGround(gridsData, this);
        this.sprites = [];
        this.draggable = true;
    }
    get elements() {
        return this.sprites.concat([this.background])
    }
    
    /*
    setRelativePos (element) {
        let r = this.getRelativePos(element)
        element.relativePosInStageX = r[0]
        element.relativePosInStageY = r[1]
    }
    */
    gridLocationOf (x,y) {
        let pseudoElement = {
            posX: x,
            posY: y
        }
        // console.log("pseudoElement:",pseudoElement);
        let relPos = this.getPosRelativeTo(pseudoElement)
        // console.log("stage.pos:", [this.posX, this.posY])
        // console.log("relPos:" ,relPos)
        return [
            parseInt(-relPos[0]/TILESIZE), 
            parseInt(-relPos[1]/TILESIZE)
        ]
    }
    set posAll ([x,y]) {
        let relPos = this.getPosRelativeTo({
            posX: x, 
            posY: y
        }); //console.log([-relPos[0], -relPos[1]]," is the pos variation")
        this.pos = [x,y];
        for (let element of this.elements) {
            if (element.dragged) continue;
            element.posVariation = [-relPos[0], -relPos[1]]
        }
    }
    drag (x,y) {
        if (!this.dragged) throw Error("The element isn't dragged!")
        //console.log("pos is set to", x-this.draggingX,",",y-this.draggingY)
        this.posAll = [x-this.draggingX,y-this.draggingY]
    }  
    oneContaining (x,y) {
        for (let e of this.elements) if (e.isContaining(x, y)) return e;
        return undefined;
    }
    isInBorder (comparator, theCompared=this.background) {
        return (
        (comparator.posX >= theCompared.posX)&&
        (comparator.posY >= theCompared.posY)&&
        (comparator.bottomRightX <= theCompared.bottomRightX)&&
        (comparator.bottomRightY <= theCompared.bottomRightY)
        )
    }
    get draggedOne () {
        for (let e of this.elements)
            if (e.dragged) return e;
        if (this.dragged) return this;
        return undefined;
    }
    get movingOne () {
        for (let e of this.elements)
            if (e.moving) return e;
        return undefined;
    }
    appendPlayerFrom (spriteData) {
        this.sprites.push(new Player(spriteData, this));
    }
}

let stage = new Stage(data["grids"]);
for (let spriteData of data["sprites"]) {
    stage.appendPlayerFrom(spriteData)
}

$(function () {
    var socket = io.connect(); 
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext('2d');
    var elementLastClicked = undefined;

    canvas.width = CANVASWIDTH;
    canvas.height = CANVASHEIGHT;

    let isLastMouseEventDragging = false;

    listener = () => {
        $(canvas).click(function(event){
            e = stage.oneContaining(event.offsetX, event.offsetY)
            if (isLastMouseEventDragging) return;
            if (e) {
                e.selected = true;
                elementLastClicked = e;
                notCilcked = itemPoped(stage.elements, e);
            }
            else notCilcked = stage.elements;

            let movingOne = stage.movingOne;
            let eventGridLocation = stage.gridLocationOf(event.offsetX, event.offsetY);
            if (e === stage.background && movingOne) {
                const index = stage.sprites.indexOf(movingOne);
                requsetPlayerMovement(index, eventGridLocation)
                // console.log("you are supposedly touching",eventGridLocation)
            }
            
            for (element of notCilcked) element.selected = false
        })
    
        $(canvas).mousedown(function (event) {
            isLastMouseEventDragging = false
            //1740. now doing: make it possible to only trigger log when mousedown is not on player
            let element = stage.oneContaining(event.offsetX, event.offsetY)
            if (element === stage.background){
                stage.touch(event.offsetX,event.offsetY);
            } else {
                
                //element.touch(event.offsetX,event.offsetY);
            }
        })
        $(canvas).mousemove(function (event) {
            isLastMouseEventDragging = true;
            if (stage.dragged) stage.drag(event.offsetX,event.offsetY)
        })

        $(canvas).mouseup(function (event) {
            //1740. now doing: make it possible to only trigger log when mousedown is not on player
            for (element of stage.elements){
                element.release();
            }
            stage.release();
        })
    }
    listener();
    
    requsetPlayerMovement = function (index, location) {
        console.log("requsetPlayerMovement")
        if (index === clientControllingSpriteIndex) {
            socket.emit("move_request", {
                "index": index,
                "position": location
            })
        }
    }

    dataUpdate = () => { // it is currently not working cause there's no "sprites" or "grids" emit.
        socket.on("sprites", function (sprites) {
            stage.sprites[0].setRelativePos (stage, sprites); //[]
        });
        socket.on("background.grids", function (grids) {
            stage.background.gridsCtx = grids; //[[]]
        });
        socket.on("sprites_data_update", function (response) {
            for (spriteIndex in response) {
                stage.sprites[spriteIndex].gridPos = response[spriteIndex]["gridpos"]
            }
        });
    }
    dataUpdate();
    
    drawAll = (list,ctx) => {
        for (let reversedIndex in list) {
            let element = list[list.length-reversedIndex-1]
            element.update(ctx)
        }
    }

    drawAll(stage.elements, ctx);

    
    animate = () => {
        window.requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        drawAll(stage.elements, ctx)
        //console.log(spriteposition);
    }
    animate();
    
    keyListener= () => {
        window.addEventListener('keypress', (event) => {
            if (event.key === 'c') 
                stage.pos = [0,0]
        })   
    }
    keyListener();
})