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
    socket.on("spritemove", function (sp) {
        spriteposition = sp;
    });


    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;
    // and one grid is 40p

    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, 50, 50)

    let spriteposition = [];

    function drawSprite(ctx, sp){
        ctx.fillStyle = "red";
        ctx.fillRect(sp[0], sp[1], 50, 50);
    }
    drawSprite(ctx, spriteposition);

    

    let keystatus = {
        "d": false,
        'a': false,
        "w": false,
        's': false
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
        drawSprite(ctx, spriteposition);
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


