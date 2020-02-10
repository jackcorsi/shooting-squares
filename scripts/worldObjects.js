var worldObjects = [];
var enemySpawnTimer = {val: -2000, direction: true};
timers.push(enemySpawnTimer);

var bombSpawnTimer = {val: -2000, direction: true};
timers.push(bombSpawnTimer);

var healthSpawnTimer = {val: - 2000, direction: true};
timers.push(healthSpawnTimer);

var enemySpawnInterval = ENEMY_MAX_SPAWN_INTERVAL;
var prevEnemySpawnAttempt = 0;
var prevBombSpawnAttempt = 0;
var prevHealthSpawnAttempt = 0;

//WorldObject class
function WorldObject()
{
	worldObjects.push(this);
	this.garbage = false;
}

/**
	All WorldObject classes implement:
	- An update() method called once per frame
	- A render() method called once per frame 
	- A "garbage" flag to mark themselves for deletion from the object array
**/


//Bullet class extends WorldObject
function Bullet()
{
	WorldObject.call(this);
	this.x = shooterX + 20 - (bulletWidth / 2);
	this.y = 310;
	this.width = bulletWidth;
}

Bullet.prototype = Object.create(WorldObject);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function()
{
	this.y -= (time.elap / BULLET_SPEED);
	if (this.y < 0) this.garbage = true;
}

Bullet.prototype.render = function() { drawRect(this.x, this.y, this.width, 10); }



//Enemy class extends WorldObject
function Enemy()
{
	WorldObject.call(this);
	this.x = Math.random() * (canvas.width - ENEMY_SIZE);
	this.y = ENEMY_SIZE * -1;
	this.speed = Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED) + ENEMY_MIN_SPEED;
}

Enemy.prototype = Object.create(WorldObject.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function()
{
	this.y += (time.elap / this.speed);
	//Clever square knows which bullet is going to kill it and doesn't bother checking the others
	if (this.targetBullet && this.detectBullet()) return; 
	
	else 
	{
		for (var i = 0; i < worldObjects.length; i++) //targetBullet points to our killer
		{  
			var bullet = worldObjects[i];
			if ( ! (bullet instanceof Bullet) ) continue; 
			if (bullet.x + bullet.width <= this.x + ENEMY_SIZE + bullet.width && bullet.x + bullet.width >= this.x) 
			{
				this.targetBullet = bullet;
				if (this.detectBullet()) return;
				break;
			}
		}
	}
	
	
	if (this.y > canvas.height)
	{
		this.garbage = true;
		loseLife();
	}
}

Enemy.prototype.detectBullet = function() //Collsion detect with bullet
{
	if (this.targetBullet.y <= this.y + ENEMY_SIZE)
	{
		this.garbage = true;
		score ++;
		money += ENEMY_KILL_REWARD;
		return true;
	}
	return false;
}

Enemy.prototype.render = function() { drawRect(this.x, this.y, ENEMY_SIZE, ENEMY_SIZE, "#00FFFF"); }


//Bomb class extends WorldObject
function Bomb()
{
	WorldObject.call(this);
	this.x = Math.random() * (canvas.width - BOMB_SIZE);
	this.y = BOMB_SIZE * -1;
	this.speed = Math.random() * (BOMB_MAX_SPEED - BOMB_MIN_SPEED) + BOMB_MIN_SPEED;
}

Bomb.prototype = Object.create(WorldObject);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function()
{
	this.y += (time.elap / this.speed);
	if (this.targetBullet && this.detectBullet()) return;
	
	else 
	{
		for (var i = 0; i < worldObjects.length; i++) 
		{  
			var bullet = worldObjects[i];
			if ( ! (bullet instanceof Bullet) ) continue;
			if (bullet.x + bullet.width <= this.x + BOMB_SIZE + bullet.width && bullet.x + bullet.width >= this.x) 
			{
				this.targetBullet = bullet;
				if (this.detectBullet()) return;
				break;
			}
		}
	}
	
	if (this.y > canvas.height) this.garbage = true;
}

Bomb.prototype.detectBullet = function()
{
	if (this.targetBullet.y <= this.y + BOMB_SIZE)
	{
		this.garbage = true;
		loseLife();
		return true;
	}
	return false;
}

Bomb.prototype.render = function() {drawRect(this.x, this.y, BOMB_SIZE, BOMB_SIZE, "#FF0000");}


//Health class extends WorldObject
function Health()
{
	WorldObject.call(this);
	this.x = Math.random() * (canvas.width - HEALTH_SIZE);
	this.y = HEALTH_SIZE * -1;
	this.speed = Math.random() * (HEALTH_MAX_SPEED - HEALTH_MIN_SPEED) + HEALTH_MIN_SPEED;
}

Health.prototype = Object.create(WorldObject);
Health.prototype.constructor = Health;

Health.prototype.update = function()
{
	this.y += (time.elap / this.speed);
	if (this.targetBullet && this.detectBullet()) return;
	
	else 
	{
		for (var i = 0; i < worldObjects.length; i++) 
		{  
			var bullet = worldObjects[i];
			if ( ! (bullet instanceof Bullet) ) continue;
			if (bullet.x + bullet.width <= this.x + HEALTH_SIZE + bullet.width && bullet.x + bullet.width >= this.x) 
			{
				this.targetBullet = bullet;
				if (this.detectBullet()) return;
				break;
			}
		}
	}
	
	if (this.y > canvas.height) this.garbage = true;
}

Health.prototype.detectBullet = function()
{
	if (this.targetBullet.y <= this.y + HEALTH_SIZE)
	{
		this.garbage = true;
		lives ++;
		greenFlash = true;
		flashTimer.val = FLASH_TIME;
		return true;
	}
	return false;
}

Health.prototype.render = function() {drawRect(this.x, this.y, HEALTH_SIZE, HEALTH_SIZE, "#00FF00");}


/**
	Old spawning system had a certain probability of spawning every 250ms. This 
	made it too easy for too many to spawn in a short space of time. 
	
	New spawning system implements a max gap between two spawns. The probability of a spawn
	starts at 0 after a spawn and increases linearly up to 1 over the max gap.
	NUM_OF_POTENTIAL_SPAWNS controls the number of opportunities it is given to spawn 
	over this period. Hopefully this system forces gaps between spawns  
	
**/

function enemyShouldSpawn()
{
	var spawn = false;
	//Spawn immediately if max gap has been exceeded
	if (enemySpawnTimer.val >= enemySpawnInterval) spawn = true; 
	else 
	{
		var msPerAttempt = enemySpawnInterval / NUM_OF_POTENTIAL_SPAWNS
		var nextSpawnAttempt = msPerAttempt * (prevEnemySpawnAttempt + 1); //Next time to potentially spawn in ms
		if (enemySpawnTimer.val >= nextSpawnAttempt)
		{
			prevEnemySpawnAttempt ++; //Keeps track of which spawning attempt we're on from 0 to NUM_OF_POTENTIAL_SPAWNS
			var spawnProb = (msPerAttempt * prevEnemySpawnAttempt) / enemySpawnInterval; //Probability of a spawn
			if (Math.random() <= spawnProb) spawn = true;
		}
	}
	
	if (spawn)
	{
		enemySpawnTimer.val = 0;
		prevEnemySpawnAttempt = 0;
		enemySpawnInterval = ENEMY_MAX_SPAWN_INTERVAL - ENEMY_MAX_SPAWN_INTERVAL_DECREASE * score;
		if (enemySpawnInterval < ENEMY_MAX_SPAWN_INTERVAL_MIN) enemySpawnInterval = ENEMY_MAX_SPAWN_INTERVAL_MIN;
		return true;
	}
	return false;
}

function bombShouldSpawn()
{
	if (bombPowerupTimer.val > 0) 
	{ 
		bombSpawnTimer.val = 0; //Keep timers at 0 so one doesn't immediately spawn when powerup ends
		prevBombSpawnAttempt = 0;
		return false;
	}
	
	var spawn = false;
	if (bombSpawnTimer.val >= BOMB_MAX_SPAWN_INTERVAL) spawn = true;
	else
	{
		var msPerAttempt = BOMB_MAX_SPAWN_INTERVAL / NUM_OF_POTENTIAL_SPAWNS;
		var nextSpawnAttempt = msPerAttempt * (prevBombSpawnAttempt + 1);
		if (bombSpawnTimer.val >= nextSpawnAttempt)
		{
			prevBombSpawnAttempt ++;
			var spawnProb = (msPerAttempt * prevBombSpawnAttempt) / BOMB_MAX_SPAWN_INTERVAL;
			if (Math.random() <= spawnProb) spawn = true;
		}
	}
	
	if (spawn)
	{
		bombSpawnTimer.val = 0;
		prevBombSpawnAttempt = 0;
		return true;
	}
}


function healthShouldSpawn()
{
	var spawn = false;
	if (healthSpawnTimer.val >= HEALTH_MAX_SPAWN_INTERVAL) spawn = true;
	else
	{
		var msPerAttempt = HEALTH_MAX_SPAWN_INTERVAL / NUM_OF_POTENTIAL_SPAWNS;
		var nextSpawnAttempt = msPerAttempt * (prevHealthSpawnAttempt + 1);
		if (healthSpawnTimer.val >= nextSpawnAttempt)
		{
			prevHealthSpawnAttempt ++;
			var spawnProb = (msPerAttempt * prevHealthSpawnAttempt) / HEALTH_MAX_SPAWN_INTERVAL;
			if (Math.random() <= spawnProb) spawn = true;
		}
	}
	
	if (spawn)
	{
		healthSpawnTimer.val = 0;
		prevHealthSpawnAttempt = 0;
		return true;
	}
}