/* 4/2 1932
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

/*
let stage = { // tomorrow's task: 1. Change stage to Element; 2. Make stage draggable
    init: function(bg){
        this.background = bg;
        this.posX = bg.posX;
        this.posY = bg.posY;
    },
    get elements() {
        return this.players.concat([this.background])
    },
    elements: [],
    players: [],
    getRelativePos: function (element) {
        return [
            element.posX-this.posX, 
            element.poxY-this.posY
        ]
    },
    isInAnyonesField: function (x,y) {
        for (let e of this.elements) if (e.isInField(x, y)) return e;
    },
    // elementsUpdate: function () {
    //     this.elements = this.players.concat([this.background])
    // },
    
    appendPlayer: function (newPlayer) {
        this.players.push(newPlayer);
        // this.elementsUpdate();
    }
}
*/

class Element { // old element class that doesn't use grid pos
    constructor (pos, size, layer) {
        this.posX = pos[0];
        this.posY = pos[1];
        this.sizeX = size[0];
        this.sizeY = size[1];
        this.selected = false;
        this.dragged = false;
        this.draggingX = undefined;
        this.draggingY = undefined
        this.layer = layer; //尚未實裝
    }
    get pos() {return [this.posX, this.posY]};
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
    isInField (x, y) {
        if (this.posX < x && x < this.posX+this.sizeX && this.posY < y && y < this.posY+this.sizeY){
            return true
        }
        return false
    }
    setPos(a,b, variation=false) {
        if (variation) {
            this.posX+= a;
            this.posY+= b;
            return;
        }
        this.posX = a;
        this.posY = b;
    }
    getPosRelativeTo (element) { // 自己相對於element的位置
        return [
            this.posX-element.posX,
            this.posY-element.posY
        ]
    }
    setRelativePos (element, relPos) {
        this.posX = element.posX+relPos[0];
        this.posY = element.posY+relPos[1];
    }
    drag(x,y) {
        if (!this.draggable) return;
        this.setPos(x-this.draggingX,y-this.draggingY)
    }
    // abstract
    draw () {
        throw new Error("wtf hell man u haven't implemented draw() yet!")
    }
}



