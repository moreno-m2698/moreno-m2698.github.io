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

var relative_start = { //This will be used to position the conway units during initial testing
    x: undefined,
    y: undefined
}
relative_start.x = 0;
relative_start.y = 0;
var squareLength = 20;


//These control how many units are in the grids vert/hor
var vertical_limit = 47, //Will cut off bottom row for now
horizontal_limit = 96;

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function ConwayUnit(x, y, squareLength, x_index, y_index) {
    this.x = x;
    this.y = y;
    this.width = squareLength;
    this.height = squareLength;
    this.alive = false;
    this.x_index = x_index;
    this.y_index = y_index;
    this.board = [];
    //list of booleans
    this.neighbors = [];
    
    this.draw = function() {
        context.fillStyle = "#F2F2F2"; //Creates rectangle fill
        context.fillRect(this.x, this.y, this.width, this.height);

        context.strokeStyle="#BFBFBF" //Creates rectangle outline
        context.lineWidth = .1;
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.stroke();
    }
    this.update = function() { //checks if unit is alive and will update its physical appearance accordingly
        context.clearRect(this.x, this.y, this.width, this.height);
        if (this.alive) {
            this.draw();
        }
        else {
            context.fillStyle = "#262626"; //Creates rectangle fill
            context.fillRect(this.x, this.y, this.width, this.height);

            context.strokeStyle = '#BFBFBF';
            context.lineWidth = .1;
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.stroke();
        }

    }
    this.toggle = function() { //This function will allow us to choice the cells starting state
        this.alive = !this.alive;
        this.update();
    }
    
    //for vertical senscing need to be mindful of how much space above html elements take
        //another note, there seems to be some dependence on where the browser is currently located (observed when scrolling down webpage, the function doesnt work)

    this.get_neighbor_coords = function(x, y) {
        return [[x - 1, y - 1], [x - 1 , y], [x - 1 , y + 1], [x, y-1], [x, y + 1], [x + 1, y-1], [x + 1, y], [x + 1, y + 1]];
    }

    this.neighbor_info = function() {

        const potentialNeighbors = this.get_neighbor_coords(this.x_index, this.y_index);

        this.neighbors = potentialNeighbors.map(coord => {
            if (!(this.board[coord[1]] === undefined)) {
                const board_state = this.board[coord[1]][coord[0]];
            
            if (!(board_state === undefined)) {
                    return board_state.alive;
            }
        }
        })

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

            const start_x = relative_start.x + squareLength * j;
            const start_y = relative_start.y + squareLength * i;
            x_index = j;
            y_index = i;
            board_array[i].push(new ConwayUnit(start_x, start_y, squareLength, x_index, y_index));
        }

    }

    for (i = 0; i < vertical_limit; i++) { // This passes in the compvare board into each so that they are aware of each other (honestly might just need to do local units)
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
                for (let y = element.y_index - 1; y <= element.y_index +1; y++) {
                    for(let x = element.x_index - 1; x <= element.x_index + 1; x++) {
                        if ( x >= 0 && x < horizontal_limit && y >= 0 && y < vertical_limit){ //ensures that we dont include cells that dont exist outside the bounds of the sheet
                            if (!(x in check_json)) {
                                check_json[x] = [y];    
                            }
                            else {
                                isHeld = false;
                                for(let j = 0; j < check_json[x].length; j++) {
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

var initial_alive_list = [[0,0], [1,0], [0,1], [3,3], [3,2], [2,3], [8,1], [6,1], [7,1], [1,6], [2,7], [0,8], [1,8], [2,8]]

function setBoard(list) { //Will take in a list of length 2 arrays for the positions [x,y]
    for (let element = 0; element < list.length; element++) {
        board_array[list[element][1]][list[element][0]].alive = true;
    }
}

function setInitials() {
    const mappingJson = {
        "Glider and Oscillator": [[0,0], [1,0], [0,1], [3,3], [3,2], [2,3], [8,1], [6,1], [7,1], [1,6], [2,7], [0,8], [1,8], [2,8]],
        "Gosper Glider Gun": [  [0,4], [1,4], [0,5], [1,5],
        [10,4], [10,5], [10,6], [11,3], [11,7], [12,2], [12,8], [13,2], [13,8], [14,5], [15,3], [15,7], [16,4], [16,5], [16,6], [17,5], [20,2], [20,3], [20,4], [21,2], [21,3], [21,4], [22,1], [22,5], [24,0], [24,1], [24,5], [24,6], [34,2], [34,3], [35,2], [35,3]
      ]
    }
    const selectedValue = document.getElementById("dropdown").value;


    board_array.forEach( (row) => row.forEach( (cell) => cell.alive = false));
    setBoard(mappingJson[selectedValue]);

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

            let alive_count = 0;

            if (board_array[check_json[key][index]][key].alive) {

                for (let i = 0; i < board_array[check_json[key][index]][key].neighbors.length; i++) {

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

                for (let i = 0; i < board_array[check_json[key][index]][key].neighbors.length; i++) {
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
    isRunning = !isRunning;
}




window.addEventListener('click', function(event) { //This is what allows us to click on the cells to toggle their state
    let xVal = event.x + this.scrollX;
    let yVal = event.y + this.scrollY;

    const relativeY = board_array[0][0].y
    const relativeX = board_array[0][0].x

    let row = Math.floor((yVal - relativeY) / squareLength);
    let col = Math.floor((xVal - relativeX) / squareLength);

    let clickedCell = board_array[row][col];

    clickedCell.toggle();

    
}, false);



function animate() { //requestAnimationFrame seems to be used for smooth animations but this isnt an issue for now since we are only turning cells on/off
                    //Might try a more analog approach and see if js has a wait function like python and have a loop work over that
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


animate();