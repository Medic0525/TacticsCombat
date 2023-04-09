import {
    multiply2DVectors as multArr,
    addUp2DVectors as addArr,
    minus2DVectors as minusArr
} from "/static/modules/frontend/functions.js";

export class Element {
    constructor (pos, size, stage, layer) {
        this.stage = stage;
        this.pos = pos;
        this.size = size;
        this.selected = false;
        this.dragged = false;
        this.dragging = [undefined,undefined];
        this.layer = layer; //尚未實裝
    }
    get bottomRight () {return [this.posX+this.sizeX,this.posY+this.sizeY]}

    //#region : Position Components Getter
    get posX () {return this.pos[0]}
    get posY () {return this.pos[1]}
    get draggingX() {return this.dragging[0]}
    get draggingX() {return this.dragging[1]}
    get bottomRightX() {return this.bottomRight[0]}
    get bottomRightY() {return this.bottomRight[1]}
    //#endregion
    hold ([x,y]) {
        if (!this.draggable) throw new Error("This element is not draggable!")
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
    isContaining ([x,y]) {
        if (this.posX < x && x < this.posX+this.sizeX && this.posY < y && y < this.posY+this.sizeY){
            return true
        }
        return false
    }
    setPosVariation([x,y]) {
        this.pos = addArr(this.pos,[x,y])
    }
    getPosRelativeTo ([x,y]) { // 自己相對於element的位置
        return minusArr(this.pos, [x,y])
    }
    setRelativePos (elementPos, relPos) {
        this.pos = addArr(elementPos, relPos);
    }
    drag([x,y]) {
        if (!this.draggable) return;
        this.pos = [x-this.draggingX,y-this.draggingY];
    }
    // abstract
    draw () {
        throw new Error("wtf hell man u haven't implemented draw() yet!")
    }
}

class ElementInGrid extends Element {
    constructor (gridPos, size, stage, layer, tileSize) {
        super (
            addArr(multArr(gridPos,[tileSize,tileSize]), stage.pos),
            size,
            stage,
            layer
        );
        this.gridPos = gridPos;
    }
    get stageOffset() {
        return multArr(this.gridPos,[this.tileSize,this.tileSize]) 
    }
    get pos () {
        return addArr(this.stageOffset,this.stage.pos)
    }
    set pos (pos) {
        if (!dragged) throw new Error("You cannot set position straightly when not dragged!");
        this._pos = pos;
    }
    //#region : Position Components Getter
    get stageOffsetX () {return this.stageOffset[0]}
    get stageOffsetY () {return this.stageOffset[1]}
    get gridPosX () {return this.gridPos[0]}
    get gridPosY () {return this.gridPos[1]}
    //#endregion
    
    getGridPosRelativeTo (element) {
        return [
            this.gridPosX-element.gridPosX,
            this.gridPosX-element.gridPosX
        ]
    }
    /*
    setGridPosVariation(x,y) { // deprecated method
        this.gridPosX+= x;
        this.gridPosY+= y;
        return;
    }*/
}

export class Player extends ElementInGrid {
    constructor (spriteData,stage) {
        super(
            spriteData["gridpos"], 
            [50,50],
            stage,
            undefined,
            stage.tileSize
        );
        this.readyToMove = false;
    }
    toggleMoving () {
        if (this.readyToMove) {
            this.readyToMove = false; 
        } else {
            this.readyToMove = true; 
        }
    }
    get selected () {
        return this._selected
    }
    set selected (bool) {
        if (bool) this.toggleMoving();
        else this.readyToMove = false;
        this._selected = bool;
    }
    draw (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.posX, this.posY, 50, 50);
    }
    update (ctx) {
        this.draw(ctx);
        if (this.selected) {
            if (this.readyToMove) ctx.fillStyle = "cyan";
            else ctx.fillStyle = "blue";
            ctx.fillRect(this.posX, this.posY, 50, 50);
        } 
    }
}
export class BackGround extends Element {
    tileDict = {0: "green",1: "black", 2: "yellow"};
    constructor (sceneData,stage) {
        super(
            stage.pos, 
            [
                stage.tileSize*stage.gridAmountX, 
                stage.tileSize*stage.gridAmountX
            ],
            stage,
            undefined
        );
        this.gridsCtx = sceneData.grids;
        this.tileDict = sceneData.tiledict;
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
export class Stage extends Element{
    constructor (sceneData, configs) {
        super(
            configs.initPos, 
            [
                configs.tileSize*sceneData.grids.length, 
                configs.tileSize*sceneData.grids[0].length, 
            ],
            undefined,
            undefined
        );
        this.tileSize = configs.tileSize;
        this.background = new BackGround(sceneData, this);
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
    gridLocationOf ([x,y]) {
        // console.log("pseudoElement:",pseudoElement);
        let relPos = this.getPosRelativeTo([x,y])
        // console.log("stage.pos:", [this.posX, this.posY])
        // console.log("relPos:" ,relPos)
        return [
            parseInt(-relPos[0]/TILESIZE), 
            parseInt(-relPos[1]/TILESIZE)
        ]
    }
    set posAll ([x,y]) {
        let relPos = this.getPosRelativeTo([x,y]); 
        //console.log([-relPos[0], -relPos[1]]," is the pos variation")
        this.pos = [x,y];
        for (let element of this.elements) {
            if (element.dragged) continue;
            element.setPosVariation(minusArr([0,0],relPos))
        }
    }
    drag ([x,y]) {
        if (!this.dragged) throw Error("The element isn't dragged!")
        //console.log("pos is set to", x-this.draggingX,",",y-this.draggingY)
        this.posAll = [x-this.draggingX,y-this.draggingY]
    }  
    oneContaining ([x,y]) {
        for (let e of this.elements) if (e.isContaining([x, y])) return e;
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
    get oneReadyToMove () {
        for (let e of this.elements)
            if (e.readyToMove) return e;
        return undefined;
    }
    appendPlayerFrom (spriteData) {
        this.sprites.push(new Player(spriteData, this));
    }
    drawAll (ctx) {
        for (let reversedIndex in this.elements) {
            let element = this.elements[this.elements.length-reversedIndex-1];
            element.update(ctx);
        }
    }
}
