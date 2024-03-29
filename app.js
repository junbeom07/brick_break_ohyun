// JavaScript 코드가 여기에 들어갈 것입니다.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = -2;
var dy = -2;
const ballRadius = 10;
const paddleHeight = 15;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score= 0



const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
              const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
              const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = "#0095DD";
              ctx.fill();
              ctx.closePath();
  }
}
}
}
function collisionDetection() {
for (let c = 0; c < brickColumnCount; c++) {
  for (let r = 0; r < brickRowCount; r++) {
    const b = bricks[c][r];
    if(b.status ===1)
      if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
        dy = -dy;
        b.status = 0;
        score++
        // console.log(score)
        if (score == brickRowCount * brickColumnCount) {
          alert("YOU WIN, CONGRATULATIONS!");
          document.location.reload();
        }
        
    }
  }
}
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

    
  

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
ctx.beginPath();
ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
}
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 공 조작
    drawBall();
    collisionDetection()
    drawScore()
  
    if (x + dx > canvas.width -ballRadius|| x + dx < ballRadius) {
    dx = -dx;
    }

    if (y + dy < ballRadius) {
    dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
    } else {
    alert("GAME OVER");
    document.location.reload();
    clearInterval(interval)
     }
    }



    x += dx;
    y += dy;
    // 패드 조작
    drawPaddle();

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
    }
    drawBricks();
}


const interval = setInterval(draw, 10);
    // More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

// load the model and metadata
// Refer to tmImage.loadFromFiles() in the API to support files from a file picker
// or files from your local hard drive
// Note: the pose library adds "tmImage" object to your window (window.tmImage)
model = await tmImage.load(modelURL, metadataURL);
maxPredictions = model.getTotalClasses();

// Convenience function to setup a webcam
const flip = true; // whether to flip the webcam
webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
await webcam.setup(); // request access to the webcam
await webcam.play();
window.requestAnimationFrame(loop);

// append elements to the DOM
document.getElementById("webcam-container").appendChild(webcam.canvas);
labelContainer = document.getElementById("label-container");
for (let i = 0; i < maxPredictions; i++) { // and class labels
labelContainer.appendChild(document.createElement("div"));
}
}

async function loop() {
webcam.update(); // update the webcam frame
await predict();
window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
// predict can take in an image, video or canvas html element
const prediction = await model.predict(webcam.canvas);
for (let i = 0; i < maxPredictions; i++) {
const classPrediction =
    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
labelContainer.childNodes[i].innerHTML = classPrediction;
}
const sortedPrediction= prediction.sort((x,y)=>y.probability-x.probability)
const result =  sortedPrediction[0].className;
if (result==='오른쪽'){
leftPressed=false
rightPressed=true
}else if(result==='왼쪽'){
leftPressed=true
rightPressed=false

}
else{
leftPressed=false
rightPressed=false

}
}