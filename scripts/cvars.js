//Change the numbers only or you'll probably screw up the game
//Movement speeds are given in milleseconds per pixel (lower is faster)

const SHOOT_INTERVAL = 500; //ms
const SHOOTER_SPEED = 3; 
const BULLET_SPEED = 2; 
const LIVES = 3;
   
const ENEMY_SIZE = 30;
const ENEMY_MIN_SPEED = 10; //Lower is faster so min is actually max. Deal with it.
const ENEMY_MAX_SPEED = 20; 

const BOMB_SIZE = 20;
const BOMB_MIN_SPEED = 10;
const BOMB_MAX_SPEED = 15;

const HEALTH_SIZE = 30;
const HEALTH_NUMBER_OF_LIVES = 1;
const HEALTH_MIN_SPEED = 10;
const HEALTH_MAX_SPEED = 20;

const FLASH_TIME = 400;

//How often stuff is given the opportunity to spawn
const NUM_OF_POTENTIAL_SPAWNS = 10;
const ENEMY_MAX_SPAWN_INTERVAL = 4000;
const ENEMY_MAX_SPAWN_INTERVAL_DECREASE = 7; //Per score point 
const ENEMY_MAX_SPAWN_INTERVAL_MIN = 927; //The max time between two spawns will go down until it reaches this
const HEALTH_MAX_SPAWN_INTERVAL = 80000;
const BOMB_MAX_SPAWN_INTERVAL = 12000;

const ENEMY_KILL_REWARD = 3; //$$$

const FIRERATE_POWERUP_PRICE = 400;
const FIRERATE_POWERUP_DURATION = 25000;
const SHOOT_INTERVAL_POWERUP = 200;

const BOMB_POWERUP_PRICE = 200;
const BOMB_POWERUP_DURATION = 30000;

const SHIELD_PRICE = 600;
const SHIELD_DURATION = 20000;

const BULLET_WIDTH = 6;
const POWERUP_BULLET_WIDTH = 20;
const BULLET_POWERUP_PRICE = 100;
const BULLET_POWERUP_DURATION = 25000;

const DOUBLE_LIVES_PRICE = 200; //Per life gained e.g. 4 lives -> 8 lives = $800
