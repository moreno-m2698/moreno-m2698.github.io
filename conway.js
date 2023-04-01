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

    //For the next 2 methods will need to think about how we are storing board and doing comparisons since im pretty sure the board is calculated per increment and will cease to
    //work once we begin animating

    //Can bypass if i do neighbor_information and then do the conway_update since it is stored then

    this.neighbor_info = function() { //revamping the under stuff

        // Ask marcel about the error handling cause this isnt interacting the way that he said it would
        // Also update to a 1d list model

        this.neighbors = [[],[],[]];
        for (var i = this.y_index - 1; i <= this.y_index + 1; i++) {
            for (var j = this.x_index -1; j <= this.x_index + 1; j++) {
                if (this.board[i][j] == undefined) {
                    this.neighbors[i - (this.y_index - 1)].push(false);
                }
                else {
                    this.neighbors[i - (this.y_index - 1)].push(this.board[i][j].alive);
                }
            }
        }

    }


    this.neighbor_information = function() { //This will count how many alive units exist 

        //Another note: we can probably just pass the 2d array from outside to cut down on space complexity of storing pointers

        this.neighbors = [];
        if (this.y_index == 0) { //checks to see if cell is occupying the top row
            for (var i = 0; i<3; i++) {
                this.neighbors.push(false);
            }
            if (this.x_index == 0) { //checks to see if cell is occupying the left top corner
                this.neighbors.push(false);
                this.neighbors.push(false);
                for (var i = 0; i <= 1; i++) { //Current for loop and visual will break down if you try and make a board that has any length dimension of 1
                    for (var j = 0; j <= 1; j++) {
                        this.neighbors.push(this.board[i][j].alive)
                    }
                }
                return this.neighbors
            }

            else if (this.x_index == this.board[0].length - 1) { //checks to see if we are in top right corner
                for (var i = 0; i <= 1; i++) {
                    for (var j = this.x_index - 1; j <= this.x_index; j++) {
                        this.neighbors.push(this.board[i][j].alive)
                    }
                    this.neighbors.push(false);
                }
                return this.neighbors
            }

            else { //This is reserved for all the element in the top row except the corners
                for (var i = 0; i<=1; i++) {
                    for (var j = this.x_index - 1; j <= this.x_index + 1; j++){
                        this.neighbors.push(this.board[i][j].alive)
                    }
                }
                return this.neighbors
            }
            
        }

        if (this.y_index == this.board.length - 1) { //checks to see if we are in bottom row
            for (var i = 0; i < 3; i++) {
                this.neighbors.push(false);
            }
            if (this.x_index == 0) { //conditions for if we are in the bottom left corner
                this.neighbors.push(false);
                this.neighbors.push(false)
                for (var i = this.y_index - 1; i <= this.y_index; i++) {
                    for (var j = 0; j <= 1; j++) {
                        this.neighbors.push(this.board[i][j].alive);
                    }
                }
                return this.neighbors
            }

            else if (this.x_index == this.board[0].length - 1) { //Checks to see if we are in bottomr right corner
                for (var i = this.y_index - 1; i <= this.y_index; i++) {
                    for (var j = this.x_index -1; j <= this.x_index; j++) {
                        this.neighbors.push(this.board[i][j].alive);
                    }
                    this.neighbors.push(false);
                }
                return this.neighbors
            }

            else { //This is for all other elements in the bottom row
                for (var i = this.y_index - 1; i <= this.y_index; i++) {
                    for (var j = this.x_index - 1; j <= this.x_index + 1; j++) {
                        this.neighbors.push(this.board[i][j].alive);
                    }
                }
                return this.neighbors
            }
        }

        for (i = this.y_index-1; i<=this.y_index+1;i++) { //All other cases
            if (x_index == 0) {//Checks to see if we are on left edge
                this.neighbors.push(false);
                for (var j = this.x_index; j <= this.x_index + 1; j++) {
                    this.neighbors.push(this.board[i][j].alive);
                }   
            }

            else if (x_index == this.board[0].length -1) {//Checks to see if we are on the right edge
                for (var j = this.x_index - 1; j <= this.x_index; j++) {
                    this.neighbors.push(this.board[i][j].alive);
                }
                this.neighbors.push(false);   
            }

            else {
                for (var j = this.x_index - 1; j <= this.x_index+1; j++) {
                    this.neighbors.push(this.board[i][j].alive);
                }
            }
        }   
        return this.neighbors
        
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
            board_array[i][j].board = board_array
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




var initial_alive_list = [[0,0], [1,0], [0,1], [3,3], [3,2], [2,3], [8,1], [6,1], [7,1], [1,6], [2,7],[0,8],[1,8],[2,8]]

function setBoard(list) { //Will take in a list of length 2 arrays for the positions [x,y]
    for (var element = 0; element < list.length; element++) {
        board_array[list[element][1]][list[element][0]].alive = true;
    }
}

function boardUpdate() { //pass in the json thats holding the points
    
    for (key in check_json) {//This loop scans the cells surrounding a listed cell
        for (index = 0; index < check_json[key].length; index++) {
            board_array[check_json[key][index]][key].neighbor_information();
        }
    }


    //If this borks its likely how its referencing in neighbors and will create loop just for updating board

    for(key in check_json) {

        for (index = 0; index < check_json[key].length; index++) {

            if (board_array[check_json[key][index]][key].alive) {

                var alive_count = - 1;

                for (var i = 0; i < 9; i++) {

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

                var alive_count = 0;

                for (var i = 0; i < 9; i++) {
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


// window.addEventListener('click', function(event) { //This is what allows us to click on the cells to toggle their state
//     // var xVal = event.x,
//     // yVal = event.y;
//     // console.log(xVal, yVal);
//     // for (var i = 0; i < vertical_limit; i++) {
//     //     board_array[i].forEach(function(element) {
//     //         if (element.x <= xVal && xVal <= element.x + element.width && element.y <= yVal && yVal <= element.y + element.height) {
//     //             console.log(element.x_index, element.y_index, element.alive);
//     //             element.toggle();
//     //             element.neighbor_information();
//     //             console.log(element.neighbors);
//     //         }
//     //     });
//     // }
//     boardUpdate();
//     console.log(check_json);

// }, false);





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