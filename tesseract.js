const Point2D = function (x, y) {
    this.x = x;
    this.y = y;
};

const Point3D = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

const Cube = function (x, y, z, size) {

    size *= 0.5;

    Point3D.call(this, x, y, z);

    this.vertices = [new Point3D(x - size, y - size, z - size),
    new Point3D(x + size, y - size, z - size),
    new Point3D(x + size, y + size, z - size),
    new Point3D(x - size, y + size, z - size),
    new Point3D(x - size, y - size, z + size),
    new Point3D(x + size, y - size, z + size),
    new Point3D(x + size, y + size, z + size),
    new Point3D(x - size, y + size, z + size),];
    
    this.faces = [[0, 1, 2, 3], [0, 4, 5, 1], [1, 5, 6, 2], [3, 2, 6, 7], [0, 3, 7, 4], [4, 7, 6, 5]]
};

Cube.prototype = {
    rotateY: function (radian) {
        var cosine = Math.cos(radian);
        var sine = Math.sin(radian);
       
        for (let index = this.vertices.length - 1; index > -1; index--) {

            let p = this.vertices[index];
            let y;
            let z;
            if (radian <= 0) {
                
                y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
                z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

            } else {

                y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
                z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

            }

            p.y = y + this.y;
            p.z = z + this.z;

        }
    },

    rotateX: function (radian) {
        var cosine = Math.cos(radian);
        var sine = Math.sin(radian);
       
        for (let index = this.vertices.length - 1; index > -1; index--) {

            let p = this.vertices[index];
            let x;
            let z;
            if (radian <= 0) {

                x = (p.z - this.z) * -sine + (p.x - this.x) *  -cosine;
                z = (p.z - this.z) * -cosine - (p.x - this.x) * -sine;

            } else {
                    
                x = (p.z - this.z) * sine + (p.x - this.x) * cosine;
                z = (p.z - this.z) * cosine - (p.x - this.x) * sine;

            }
                

            p.x = x + this.x;
            p.z = z + this.z;

        }
    },

    rotateZ: function (radian) {
        var cosine = Math.cos(radian);
        var sine = Math.sin(radian);
       
        for (let index = this.vertices.length - 1; index > -1; index--) {

            let p = this.vertices[index];

            let x = (p.x - this.x) * cosine - (p.y - this.y) *  sine;
            let y = (p.x - this.x) * sine + (p.y - this.y) * cosine;
            p.x = x + this.x;
            p.y = y + this.y;

        }
    },
}
var rotation = {};   
var cnv = document.querySelector("canvas");
var context = cnv.getContext("2d");

var cube = new Cube(0, 0, 400, 200);

function project(points3d, width, height) {
    
    var points2d = new Array(points3d.length);

    var focal_length = 200;

    for (let index = points3d.length - 1; index > -1; index--) {

        let p = points3d[index];

        let x = p.x * (focal_length / p.z) + width * 0.5;
        let y = p.y * (focal_length / p.z) + height * 0.5;

        points2d[index] = new Point2D(x, y); 

    }

    return points2d;

}

function loop(mouse) {

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;

    context.canvas.height = height;
    context.canvas.width = width;

    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height)

    context.strokeStyle = "#ffffff";

    var zeroX = (mouse.x / width)*4 - 2;
    var zeroY = (mouse.y / height)*4- 2;


    if (!Number.isNaN(zeroX)) {
        rotation.x = zeroX;
    }

    if (!Number.isNaN(zeroY)) {
        rotation.y = zeroY;
    }

    cube.rotateX(rotation.x);
    cube.rotateY(rotation.y);
    //cube.rotateX(0.005);
    //cube.rotateZ(0.01);

    var vertices = project(cube.vertices, width, height);

    for (let index = cube.faces.length - 1; index > -1; --index){

        let face = cube.faces[index];

        context.beginPath();
        context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
        context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
        context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
        context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
        context.closePath();
        context.stroke();
    }

    cube = new Cube(0, 0, 400, 200);

}

var mouse = {};
var start = new Date();
cnv.addEventListener("mousemove", function (e) {
    var elapsed = new Date() - start;
    if (elapsed < 1000/30) {
        window.requestAnimationFrame(loop);
        return;
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    loop(mouse);
    window.requestAnimationFrame(loop);
    start = new Date();
});