const url = "http://localhost:80/";


let data, configs;
$.ajaxSetup({async: false});

let request = $.get(url+"/stage1")
.done(function(result){
    console.log("Received data:",result)
    data = result;
})
.fail(function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR, textStatus, errorThrown)
})
let configRequest = $.get("/static/stages/configs.json")
.done(function(result){
    configs = result;
})
.fail(function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR, textStatus, errorThrown);
})

const CANVASWIDTH = 600;
const CANVASHEIGHT = 600;
let clientControllingSpriteIndex = 0;


import { Stage } from "/static/modules/frontend/spriteClasses.js";
import { itemPoped } from "./modules/frontend/functions.js";

let stage = new Stage(data, configs);
for (let spriteData of data["sprites"]) {
    console.log(spriteData)
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

    function listener () {
        $(canvas).click(function(event){
            let e = stage.oneContaining([event.offsetX, event.offsetY]);
            let notCilcked;
            if (isLastMouseEventDragging) return;
            if (e) {
                e.selected = true;
                elementLastClicked = e;
                notCilcked = itemPoped(stage.elements, e);
            }
            else {
                notCilcked = stage.elements;
            }
            let oneReadyToMove = stage.oneReadyToMove;
            let eventGridLocation = stage.gridLocationOf([event.offsetX, event.offsetY]);
            if (e === stage.background && oneReadyToMove) {
                const index = stage.sprites.indexOf(oneReadyToMove);
                requsetPlayerMovement(index, eventGridLocation);
                // console.log("you are supposedly holding",eventGridLocation)
            }
            
            for (let element of notCilcked) element.selected = false
        })
    
        $(canvas).mousedown(function (event) {
            isLastMouseEventDragging = false
            //1740. now doing: make it possible to only trigger log when mousedown is not on player
            let element = stage.oneContaining([event.offsetX, event.offsetY])
            if (element === stage.background){
                stage.hold([event.offsetX,event.offsetY]);
            } else {
                
                //element.hold([event.offsetX,event.offsetY]);
            }
        })
        $(canvas).mousemove(function (event) {
            isLastMouseEventDragging = true;
            if (stage.dragged) stage.drag([event.offsetX,event.offsetY])
        })

        $(canvas).mouseup(function (event) {
            //1740. now doing: make it possible to only trigger log when mousedown is not on player
            for (let element of stage.elements){
                element.release();
            }
            stage.release();
        })
    }
    listener();
    
    function requsetPlayerMovement (index, location)  {
        console.log("requsetPlayerMovement");
        if (index === clientControllingSpriteIndex) {
            socket.emit("move_request", {
                "index": index,
                "position": location
            })
        }
    }

    function dataUpdate () { // it is currently not working cause there's no "sprites" or "grids" emit.
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
    
    

    stage.drawAll(ctx);

    
    function animate () {
        window.requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        stage.drawAll(ctx)
        //console.log(spriteposition);
    }
    animate();
    
    function keyListener () {
        window.addEventListener('keypress', (event) => {
            if (event.key === 'c') 
                stage.pos = [0,0]
        })   
    }
    keyListener();
})