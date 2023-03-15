const url = "http://localhost:81/";

let datax;
$.get(url+"/data", function(data){
    console.log("data:",data)
    datax = data;
    /*
    Sprite.pos = data["sprite.pos"];
    Space.grids = data["space.grids"];
    Space.relativePos = data["space.relativePos"]
    */
    
});

const Sprite = {
    pos: [0,0],
    draw: function (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.pos[0], this.pos[1], 50, 50);
    }
}
const Space = {
    sideLength: 50,
    relativePos:{
        x: 0, y: 0
    },
    tileDict: {
        0: "green",
        1: "black"
    },
    draw: function(ctx) {
        console.log("grids:",this.grids);
        let gridX = 0; let gridY = 0;
        for (grid_line of this.grids) {
            for (let grid of grid_line) {
                ctx.fillStyle = tileDict[grid];
                ctx.fillRect(
                    this.relativePos.x + gridX*this.sideLength,
                    this.relativePos.y + gridY*this.sideLength,
                    this.sideLength,
                    this.sideLength)
                gridX += 1;
            }
            gridY += 1;
        }
    }
}



$(function () {
    // Socket.IO Start connect
    var socket = io.connect(); 
    // Socket.IO send message
    $("#send").click(function (e) {
        // Send message
        socket.emit('send', $('#message').val())
        // Clear input field
        $('#message').val('')
    }); 
    // Socket.IO get message
    socket.on('get', function (data) {
        $('#chat_content').append('<p>I say: ' + data + '</p>');
    });
    // Socket.IO get test
    socket.on("message", function (data) {
        $('#chat_content').append('<p>System : ' + data + '</p>');
    }); 
    // Socket.IO send test
    $("#test").click(function (e) {
        socket.emit('test')
    });
    //sprite moving by keyboard controlling
    
    


    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;
    // and one grid is 40p

    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, 50, 50);


    

    
    //update
    socket.on("sprite.pos", function (spriteposition) {
        Sprite.pos = spriteposition; //[]
    });
    socket.on("space.grids", function (grids) {
        Space.grids = grids; //[[]]
    });
    socket.on("space.relativePos", function (relativePos){
        Space.relativePos = relativePos; // []
    });
    $


    Space.draw(ctx);
    Sprite.draw(ctx);

    
    

    let keystatus = {
        "d": false, 'a': false, "w": false, 's': false
    }

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
    function animate(){
        window.requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        socket.emit("key", keystatus);
        Sprite.draw(ctx);
        Space.draw(ctx);
        //console.log(spriteposition);
    }
    animate();
    
    function listener(){
        let keys = ["w", "a", "s", "d"];
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
    listener();

});


