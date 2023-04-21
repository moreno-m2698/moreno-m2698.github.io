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
    
    this.draw =  function() {
        if (this.alive) {
            context.fillStyle = "#F2F2F2"; //Creates rectangle fill
        }

        else {
            context.fillStyle = "#262626"; //Creates rectangle fill    
        }

        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = '#BFBFBF';
        context.lineWidth = .1;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.stroke();
    }

    this.clear = function() {
        context.clearRect(this.x, this.y, this.width, this.height);
    }

    this.update = function() {
        this.clear();
        this.draw();

    }
    this.toggle = function() {
        this.alive = !this.alive;
        this.update();
    }
    
    //for vertical sensing need to be mindful of how much space above html elements take
    
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
    setBoard(initial_alive_list);
    for (i = 0; i < vertical_limit; i++) { // This passes in the compvare board into each so that they are aware of each other (honestly might just need to do local units)
        for (j = 0; j < horizontal_limit; j++) {
            board_array[i][j].board = board_array;
            board_array[i][j].update();
        }
    }
}

var check_json = {};
/* Will be something of the form
{   0: [0,1,2,3],
    1: [2, 5]
}
*/

function cellAwareness(x, y) {

        if (x >= 0 && x < horizontal_limit && y >= 0 && y < vertical_limit) {
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


function newCellsToCheck() {
    board_array.forEach(function(row) {
        row.forEach(function(element) {
            if (element.alive) {
                let queue = board_array[element.y_index][element.x_index].get_neighbor_coords(element.x_index,element.y_index);
                queue.push([element.x_index,element.y_index]);
                queue.forEach(function(coord) {
                    cellAwareness(coord[0],coord[1]);
                })
            }
        })
    }) 
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


function boardUpdate() {
    
    for (key in check_json) {//This loop scans the cells surrounding a listed cell
        for (index = 0; index < check_json[key].length; index++) {
            board_array[check_json[key][index]][key].neighbor_info();
        }
    }
    let cellsToMask=[];
    let cellsToDelete=[];

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
                    board_array[check_json[key][index]][key].update();

                }
            }

            else {//dead cell logic

                for (let i = 0; i < board_array[check_json[key][index]][key].neighbors.length; i++) {
                    if (board_array[check_json[key][index]][key].neighbors[i]) {
                        alive_count++;
                    }
                }

                if(alive_count == 3) {
                    board_array[check_json[key][index]][key].alive = true;
                    board_array[check_json[key][index]][key].update();
                    cellsToMask.push([parseInt(key),check_json[key][index]])

                }
                else {
                    cellsToDelete.push([parseInt(key),check_json[key][index]])

                }

            }
        }
    }


    cellsToDelete.forEach( function(doubleDeadCoord) {
        let index = check_json[doubleDeadCoord[0]].indexOf(doubleDeadCoord[1]);
        if (index > -1) {
            check_json[doubleDeadCoord[0]].splice(index, 1);
        }
    })



    cellsToMask.forEach( function(newAliveCoord) { 
        let holder=board_array[newAliveCoord[1]][newAliveCoord[0]].get_neighbor_coords(newAliveCoord[0],newAliveCoord[1]);
        holder.push(newAliveCoord);
        holder.forEach( function(coord) {
            cellAwareness(coord[0],coord[1]);
        })

    })


    console.log(check_json)
}

window.addEventListener('click', function(event) { //This is what allows us to click on the cells to toggle their state
    
    if (!isRunning) {
        let xVal = event.x + this.scrollX;
        let yVal = event.y + this.scrollY;

        const relativeY = board_array[0][0].y
        const relativeX = board_array[0][0].x

        let row = Math.floor((yVal - relativeY) / squareLength);
        let col = Math.floor((xVal - relativeX) / squareLength);

        let clickedCell = board_array[row][col];

        clickedCell.toggle();
    }
    
}, false);

var isRunning = false;
function run_conway_game() { //attack to button and this will pause and start the application
    isRunning = !isRunning;

}

var then = Date.now()

function animate() {
    window.requestAnimationFrame(animate2);
    let now = Date.now();
    elapsed = now - then;
    
    if (elapsed > 500) {
        then = now - (elapsed % 500)

        if (isRunning) {

            boardUpdate();

            for (i = 0; i < vertical_limit; i++) {
                for (j = 0; j < horizontal_limit; j++) {
                    board_array[i][j].update();
                }
            }
        }

    }
}

init();
newCellsToCheck();

animate();