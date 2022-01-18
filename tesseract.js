var context = document.querySelector("canvas").getContext("2d");

function loop() {
    window.requestAnimationFrame(loop);

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;

    context.canvas.height = height;
    context.canvas.width = width;

}

loop();