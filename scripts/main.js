/**

Jack437 on Github - 2016
Shooting Squares Game
Copyright and all that

CAPITALISED_STUFF defined in cvars.js


**/

function resetGame() //Reset game state to initial values 
{
	shooterX = (canvas.width / 2) - 20;
	
	shootTimer.val = 0;
	enemySpawnTimer.val = -2000
	bombSpawnTimer.val = -2000;
	healthSpawnTimer.val = -2000;
	flashTimer.val = 0;
	fireratePowerupTimer.val = 0;
	bombPowerupTimer.val = 0;
	shieldTimer.val = 0;
	
	money = 0;
	
	score = 0;
	lives = LIVES;
	
	enemySpawnInterval = ENEMY_MAX_SPAWN_INTERVAL;
	prevEnemySpawnAttempt = 0;
	prevBombSpawnAttempt = 0;
	prevHealthSpawnAttempt = 0;
	
	worldObjects.splice(0, worldObjects.length);
	
	//Prevents requestAnimationFrame() being called multiple times as 
	//this seemed to cause timing errors 
	if (!playing) requestAnimationFrame(main); 
}

function loseLife()
{
	if (shieldTimer.val > 0) return; //Life not lost if shield is active
	
	lives --;
	greenFlash = false;
	flashTimer.val = FLASH_TIME;
}

//Main loop
function main()
{	
	playing = true;
	var curTime = window.performance.now();
	time.elap = curTime - time.prev;
	time.prev = curTime;
	
	//Print HUD
	var hud = document.getElementById("gameHud");
	hud.innerHTML = "Lives: " + lives + "<br> Money: $" + money + "<br> Score: " + score;
	if (fireratePowerupTimer.val > 0)
	{
		hud.innerHTML += "<br> Firerate POWER-UP: " + Math.ceil(fireratePowerupTimer.val / 1000) + " secs";
	}
	if (bombPowerupTimer.val > 0)
	{
		hud.innerHTML += "<br> No Bombs POWER-UP: " + Math.ceil(bombPowerupTimer.val / 1000) + " secs";
	}
	if (shieldTimer.val > 0)
	{
		hud.innerHTML += "<br> Shield POWER-UP: " + Math.ceil(shieldTimer.val / 1000) + " secs";
	}
	if (bulletPowerupTimer.val > 0)
	{
		hud.innerHTML += "<br> Bullet Size POWER-UP: " + Math.ceil(bulletPowerupTimer.val / 1000) + " secs";
	}
	
	
	if (input.pause)
	{
		hud.innerHTML += "<br> PAUSED";
		pauseLoop();
		requestAnimationFrame(main);
		return;
	}
	
	//Stop game if no remaining lives
	if (lives == 0) 
	{
		playing = false;
		return;
	}

	
	//Advance game timers 
	for (var i = 0; i < timers.length; i++)
	{
		var timer = timers[i];
		if (timer.direction) timer.val += time.elap;
		else if (timer.val <= time.elap) timer.val = 0;
		else timer.val -= time.elap;
	}
	
	//Process input 
	if (mouseControl)
	{
		if (mouseX < shooterX + 20) 
		{
			//Mouse control system decides which direction to travel in every frame
			if (shooterX + 20 - mouseX <= (canvas.width / 2 + 39)) 
			{
				shooterX -= time.elap / SHOOTER_SPEED;
				
				//Snap to mouse location if we've gone too far
				if (mouseX > shooterX + 20) shooterX = mouseX - 20;
			}
			else shooterX += time.elap / SHOOTER_SPEED;
			//travelling in the wrong direction is sometimes faster
		}
		else if (mouseX > shooterX + 20)
		{
			if (mouseX - shooterX + 20 <= (canvas.width / 2 + 39)) 
			{
				shooterX += time.elap / SHOOTER_SPEED;
				if (mouseX < shooterX + 20) shooterX = mouseX - 20;
			}
			else shooterX -= time.elap / SHOOTER_SPEED;
		}
		if ( (input.shoot || input.shootMouse) && shootTimer.val == 0 )
		{
			new Bullet;
			shootTimer.val = shootInterval;
		}
	}
	else 
	{
		if (input.left) shooterX -= time.elap / SHOOTER_SPEED; 
		if (input.right) shooterX += time.elap / SHOOTER_SPEED;
		if (input.shoot && shootTimer.val == 0 )
		{
			new Bullet;
			shootTimer.val = shootInterval;
		}
	}
	
	//Update powerups
	if (fireratePowerupTimer.val > 0) shootInterval = SHOOT_INTERVAL_POWERUP;
	else shootInterval = SHOOT_INTERVAL;
	
	if (bulletPowerupTimer.val > 0) bulletWidth = POWERUP_BULLET_WIDTH;
	else bulletWidth = BULLET_WIDTH;
	
	//Teleport shooter to other side of screen
	if (shooterX >= canvas.width + 39) shooterX = -39;
	if (shooterX <= -40) shooterX = canvas.width + 39;
	
	
	//Spawn stuff
	if (enemyShouldSpawn()) new Enemy;
	
	if (bombShouldSpawn()) new Bomb;

	if (healthShouldSpawn()) new Health;
	
	
	context.clearRect(0, 0, canvas.width, canvas.height); //Clear canvas for drawing
	
	//Update world objects
	for (var i = 0; i < worldObjects.length; i++) worldObjects[i].update();
	
	for (var i = 0; i < worldObjects.length; i++) if (worldObjects[i].garbage) worldObjects.splice(i, 1);
	
	for (var i = 0; i < worldObjects.length; i++) worldObjects[i].render();

	
	//Draw shooter
	var colour;
	if (flashTimer.val != 0)
	{
		if (greenFlash) colour = "#00FF00";
		else colour = "#FF0000";
	}
	
	var barrelY;
	if (shootTimer.val == 0) barrelY = 290; 
	//Sexy recoil animation
	else 
	{
		var halfTime = shootInterval / 2;
		if (shootTimer.val <= halfTime) barrelY = 290 + (shootTimer.val / halfTime) * 20;
		else barrelY = 310 - ((shootTimer.val  - halfTime) / halfTime) * 20;
	}
	drawRect(shooterX, 300, 40, 20, colour);
	drawRect(shooterX + 20 - (bulletWidth / 2), barrelY, bulletWidth, 10, colour);
	
	mouseClicks.splice(0, mouseClicks.length); //Clear mouse click register
	
	//Performance monitoring
	if (framerateAvgTimer.val == 0) 
	{
		avgFramerate = Math.round( framerateTotal / frameCount );
		framerateTotal = 0;
		frameCount = 0;
		framerateAvgTimer.val = 1500;
		
		highFrameElap = 0;
	}
	
	framerateTotal += (1000 / time.elap);
	frameCount ++;
	time.frameElap = window.performance.now() - time.prev;
	if (time.frameElap > highFrameElap) highFrameElap = time.frameElap;
	debug("fps: " + Math.round(1000 / time.elap) + " -- avg fps: " + avgFramerate + " -- Slowest tick: " + highFrameElap.toFixed(2) + " ms");
	
	requestAnimationFrame(main);
}

function drawRect(x, y, height, width, colour = colourChoice) //Draw rectangles. "10/10 awesome graphics" - IGN
{
	context.beginPath();
	context.rect(x, y, height, width);
	context.fillStyle = colour;
	context.fill();
	context.closePath();
}

context.font = "18px Arial";
context.textAlign = "center";
function drawText(text, x, y, maxWidth) 
{ 
	context.fillStyle = "#000000";
	context.fillText(text, x, y, maxWidth); 
}

//Keyboard inputs
function onKeyDown(event)
{
	if (event.code == "ArrowLeft") input.left = true;
	else if (event.code == "ArrowRight") input.right = true;
	else if (event.code == "Space") input.shoot = true;
}

function onKeyUp(event)
{
	if (event.code == "ArrowLeft") input.left = false;
	else if (event.code == "ArrowRight") input.right = false;
	else if (event.code == "Space") input.shoot = false;
}

function onKeyPress(event) 
{ 
	if (event.code == "KeyP") input.pause = !input.pause; 
	else if (event.code == "KeyR") resetGame();
}

function trackMouse(event)
{
	mouseX = event.clientX - canvas.getBoundingClientRect().left;
	mouseY = event.clientY - canvas.getBoundingClientRect().top;
}

function canvasClick(event)
{
	var obj = {};
	obj.x = event.clientX - canvas.getBoundingClientRect().left;
	obj.y = event.clientY - canvas.getBoundingClientRect().top;
	mouseClicks.push(obj);
}

function canvasMouseDown(event) 
{
	input.shootMouse = true; 
	event.preventDefault();
}

function canvasMouseUp(event) {input.shootMouse = false;}

//Write debug stuff above the canvas
function debug(text) { document.getElementById("debugPara").innerHTML = text; }

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;
document.onkeypress = onKeyPress;

canvas.onmousemove = trackMouse;
canvas.onclick = canvasClick;
canvas.onmousedown = canvasMouseDown;
canvas.onmouseup = canvasMouseUp;

requestAnimationFrame(main);
