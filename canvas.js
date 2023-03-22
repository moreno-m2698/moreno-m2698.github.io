console.log('Hello')
var canvas = document.querySelector('canvas'); 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 


var context = canvas.getContext('2d');
// context.fillStyle ='rgba(255, 0, 0, 0.5)';
// context.fillRect(100, 100 ,100,100);

// //line
// context.beginPath();
// context.moveTo(50, 300); //Creates initial point of line
// context.lineTo(300, 100);// Creates end point
// context.strokeStyle = "green"; // Conext to css colors
// context.stroke();// physically draws the object

//arc/circles

// creating tons of circles

// for (var i = 0; i < 3; i++) {
//     var x = Math.random() * window.innerWidth;
//     var y = Math.random() * window.innerHeight;
//     context.beginPath();
//     context.arc(x, y, 30, 0, Math.PI * 2, false);
//     context.strokeStyle = "red";
//     context.stroke();
// }   

var mouse = {
    x: undefined,
    y: undefined
}
var maxRadius = 40;
var minRadius = 2;
var colorArray = [
    '#D9042B',
    '#402F21',
    '#F27329',
    '#8C240D',
    '#D93B18'
];



window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

})

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
    init();
})



function BouncyCircle(x, y, dx, dy, radius, minRadius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;

    this.color = colorArray[Math.floor(Math.random() * colorArray.length)]

    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.strokeStyle = this.color;
        context.fillStyle = this.color
        context.closePath();
        context.fill();
        context.stroke();
    }

    this.update = function() {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) [
            this.dx = -this.dx
        ]
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy
        }
        this.x += this.dx;
        this.y += this.dy;

        // interactivity

        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radius < maxRadius) {
            this.radius += 1 }
        } else if (this.radius > this.minRadius) {
            this.radius -= 1;
        }

        this.draw()

    }
}

var circleArray = [];

function init() {

    circleArray = [];

    for (var i = 0; i < 400; i++) {
        var radius = Math.random() * 3 + 1;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var dx = (Math.random() - 0.5);
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dy = (Math.random() - 0.5);
        
    
        circleArray.push(new BouncyCircle(x, y, dx, dy, radius));
    
    }

}



function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0,0, innerWidth, innerHeight);

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();

    }

}

init();
animate();