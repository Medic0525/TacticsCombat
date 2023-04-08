export class Element {
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


export class Player extends Element {
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
export class BackGround extends Element {
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
export class Stage extends Element{
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
