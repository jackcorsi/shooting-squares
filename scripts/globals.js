var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var shooterX = (canvas.width / 2) - 20;
var time = {prev: 0, elap: 0}; //Time passsed since last frame
var timers = []; //Contains timer objects of composition: {val as integer, direction as bool (true = counting up)}

var shootTimer = {val: 0, direction: false};
timers.push(shootTimer);

var flashTimer = {val: 0, direction: false};
timers.push(flashTimer); //Timer  controls colour change of shooter

var framerateAvgTimer = {val: 1500, direction: false}; //used for calculating average framerate over a period of time 
timers.push(framerateAvgTimer);

//Powerup timers control whether powerups are active 
var fireratePowerupTimer = {val: 0, direction: false};
timers.push(fireratePowerupTimer);

var bombPowerupTimer = {val: 0, direction: false};
timers.push(bombPowerupTimer);

var shieldTimer = {val: 0, direction: false};
timers.push(shieldTimer);

var bulletPowerupTimer = {val: 0, direction: false};
timers.push(bulletPowerupTimer);

var greenFlash; //For green or red flash of shooter

var input = {left: false, right: false, shoot: false, pause: false, shootMouse: false}; //Keyboard input
var mouseX;
var mouseY; //Set in response to mouse movement events in the canvas

var score = 0;

var lives = LIVES;

var mouseClicks = []; //Mouse click events

var playing = false; //Indicates whether the game is in play

var framerateTotal = 0; //Used for calculating average framerate
var frameCount = 0; 
var avgFramerate = 0;
var highFrameElap = 0; //Performance metric: slowest update loop

var mouseControl = false; //Use mouse for input
var colourChoice = "#00FFFF";

var money = 0;

var shootInterval = SHOOT_INTERVAL;

var bulletWidth = BULLET_WIDTH;