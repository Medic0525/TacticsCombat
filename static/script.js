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

import {
    Element, Player, BackGround, Stage
} from "modules/frontend_classes.js";

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