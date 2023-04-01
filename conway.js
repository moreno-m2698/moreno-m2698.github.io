var canvas = document.querySelector('canvas'); //Allows interaction with html canvas 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
console.log(canvas.width) //1920
console.log(canvas.height) //929
var context = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

//-----------------------------------------------------------------------------------------------------------------------------------------------------

//These are initial conditions that can be changed for testing purposes

relative_start = { //This will be used to position the conway units during initial testing
    x: undefined,
    y: undefined
}
relative_start.x = 0;
relative_start.y = 0;
square_length = 30;


//These control how many units are in the grids vert/hor
vertical_limit = 20,
horizontal_limit = 20;

//To test conway logic want to make first grid 6x6 with no dependenct on size of canvas yet


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function ConwayUnit(x, y, square_length, x_index, y_index) {
    this.x = x;
    this.y = y;
    this.width = square_length;
    this.height = square_length;
    this.alive = false;
    this.x_index = x_index;
    this.y_index = y_index;
    this.board = [];
    this.neighbors = [];
    this.neighbor_coords = [];


    this.draw = function() {
        context.fillStyle = "rgba(255, 0, 0, 0.5)"; //Creates rectangle fill
        context.fillRect(this.x, this.y, this.width, this.height);

        context.strokeStyle="black" //Creates rectangle outline
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.stroke();
    }
    this.update = function() { //checks if unit is alive and will update its physical appearance accordingly
        context.clearRect(this.x, this.y, this.width, this.height);
        if (this.alive == true) {
            this.draw();
        }
        else if (this.alive == false) {
            context.strokeStyle = 'black';
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.stroke();
        }

    }
    this.toggle = function() { //This function will allow us to choice the cells starting state
        if(this.alive == true) {
            this.alive = false;
        }
        else {
            this.alive = true;
        }
        this.update();
    }
    
    //for vertical senscing need to be mindful of how much space above html elements take
        //another note, there seems to be some dependence on where the browser is currently located (observed when scrolling down webpage, the function doesnt work)

    this.get_neighbor_coords = function() {
        this.neighbor_coords = [];
        const x = this.x_index;
        const y = this.y_index;
        this.neighbor_coords = [[x - 1, y - 1], [x - 1 , y], [x - 1 , y + 1], [x, y-1], [x, y + 1], [x + 1, y-1], [x + 1, y], [x + 1, y + 1]]
        
    }

    this.neighbor_info = function() {

        this.neighbors = [];
        this.get_neighbor_coords();
        this.neighbor_coords.forEach(coord => {
            if (!(this.board[coord[1]] === undefined)) {
                const board_state = this.board[coord[1]][coord[0]];
            if (!(board_state === undefined)) {
                this.neighbors.push(board_state.alive);
            }
            console.log(board_state)
        }
        });

    }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

window.addEventListener('click', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

}, false)

var board_array = []

function init() { // Creates all the cells and populates a 2d array holding them

    for (i = 0; i < vertical_limit; i++) {
        board_array.push([])
        for (j = 0; j < horizontal_limit; j++) {

            var start_x = relative_start.x + square_length * j;
            var start_y = relative_start.y + square_length * i;
            x_index = j;
            y_index = i;
            board_array[i].push(new ConwayUnit(start_x, start_y, square_length, x_index, y_index));
        }

    }

    for (i = 0; i < vertical_limit; i++) { // This passes in the complete board into each so that they are aware of each other (honestly might just need to do local units)
        for (j = 0; j < horizontal_limit; j++) {
            board_array[i][j].board = board_array;
        }
    }
}

var check_json = {};
/* Will be something of the form
{   0: [0,1,2,3],
    1: [2, 5]
}

*/

function CellsToCheckJSON() {
    for (i = 0; i < vertical_limit; i++) {
        board_array[i].forEach(function(element) {
            if (element.alive) { //checks if cell is alive
                for (var y = element.y_index - 1; y <= element.y_index +1; y++) {
                    for(var x = element.x_index - 1; x <= element.x_index + 1; x++) {
                        if ( x >= 0 && x < horizontal_limit && y >= 0 && y < vertical_limit){ //ensures that we dont include cells that dont exist outside the bounds of the sheet
                            if (!(x in check_json)) {
                                check_json[x] = [y];    
                            }
                            else {
                                isHeld = false;
                                for(var j = 0; j < check_json[x].length; j++) {
                                    if (check_json[x][j]==y) {
                                        isHeld = true;
                                        break

                                    }
                                }
                                if (!isHeld) {
                                    check_json[x].push(y);
                                }

                            }
                        }
                       
                    }
                }
            }
        })

    }
    
}


    // Need to create an initial board function so that we can test the initial alive function 

    // Will probalby need to think about making the board its own object so that we can hold all these things


var initial_alive_list = [[0,0], [1,0], [0,1], [3,3], [3,2], [2,3], [8,1], [6,1], [7,1], [1,6], [2,7], [0,8], [1,8], [2,8]]

function setBoard(list) { //Will take in a list of length 2 arrays for the positions [x,y]
    for (var element = 0; element < list.length; element++) {
        board_array[list[element][1]][list[element][0]].alive = true;
    }
}

function boardUpdate() { //pass in the json thats holding the points
    
    for (key in check_json) {//This loop scans the cells surrounding a listed cell
        for (index = 0; index < check_json[key].length; index++) {
            board_array[check_json[key][index]][key].neighbor_info();
        }
    }


    //If this borks its likely how its referencing in neighbors and will create loop just for updating board

    for(key in check_json) {

        for (index = 0; index < check_json[key].length; index++) {

            var alive_count = - 0;

            if (board_array[check_json[key][index]][key].alive) {

                for (var i = 0; i < board_array[check_json[key][index]][key].neighbors.length; i++) {

                    if (board_array[check_json[key][index]][key].neighbors[i]) {

                        alive_count++;

                    }
                }

                if (alive_count < 2 || alive_count > 3) {

                    board_array[check_json[key][index]][key].alive = false;
                    //board_array[check_json[key][index]][key].update();

                }
            }

            else {

                for (var i = 0; i < board_array[check_json[key][index]][key].neighbors.length; i++) {
                    if (board_array[check_json[key][index]][key].neighbors[i]) {
                        alive_count++;
                    }
                }

                if(alive_count == 3) {
                    board_array[check_json[key][index]][key].alive = true;
                    //board_array[check_json[key][index]][key].update();
                }

            }
        }
    }

    for (i = 0; i < vertical_limit; i++) {
        for (j = 0; j < horizontal_limit; j++) {
            board_array[i][j].update();
        }
    }
    check_json = {};
    CellsToCheckJSON();

}



var isRunning = false;

function run_conway_game() { //attack to button and this will pause and start the application

}


window.addEventListener('click', function(event) { //This is what allows us to click on the cells to toggle their state
    var xVal = event.x,
    yVal = event.y;
    console.log(xVal, yVal);
    for (var i = 0; i < vertical_limit; i++) {
        board_array[i].forEach(function(element) {
            if (element.x <= xVal && xVal <= element.x + element.width && element.y <= yVal && yVal <= element.y + element.height) {
                console.log(element.x_index, element.y_index, element.alive);
                //element.toggle();
                element.neighbor_info();
                console.log(element.neighbors);
            }
        });
    }
    
}, false);





function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);
    for (i = 0; i < vertical_limit; i++) {
        for (j = 0; j < horizontal_limit; j++) {
            board_array[i][j].update();
        }
    }
}

init();

//Need to lock the order of these functions into the pause/play button
setBoard(initial_alive_list);
CellsToCheckJSON();
console.log(check_json);



animate();