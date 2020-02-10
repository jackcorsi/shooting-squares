var colourChoices = ["#FF8000", "#FFFF00", "#0000FF", "#FF0040", "#8000FF", "#00FFFF"]; //Customisable colour options

var menuButtons = [];


/**
	Menu button objects implement:
	- A render() method called once per frame
	- A hover flag indicating whether the mouse is hovering over the button
	- A click() method called when the button is clicked 
	- A length property
	- A height property 
	- An x property
	- A y property
**/

var unpauseButton = {hover: false, length: 150, height: 50, x: (canvas.width / 2) - 75, y: canvas.height * 0.9 - 25};

unpauseButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawText("Unpause", canvas.width / 2, this.y + this.height / 2, this.width);
}

unpauseButton.click = function() 
{ 
	input.pause = false; 
}


var mouseControlButton = {hover: false, length: 150, height: 50, x: canvas.width * 0.2 - 75, y: canvas.height / 2 - 25};

mouseControlButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	if (mouseControl)
	{
		drawText("Mouse Control: Enabled", this.x + this.length / 2, this.y + this.height / 2, this.length);
	}
	else
	{
		drawText("Mouse Control: Disabled", this.x + this.length / 2, this.y + this.height / 2, this.length);
	}
}

mouseControlButton.click = function() { mouseControl = !mouseControl; }


var colourButton =  {hover: false, length: 150, height: 50, x: canvas.width * 0.8 - 75, y: canvas.height / 2 - 25};

colourButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawRect(this.x + 120, this.y + 10, 30, 30, colourChoice);
	drawText("Shooter Colour" , this.x - 15 + this.length / 2, this.y + this.height / 2, this.length - 30);
}

colourButton.click = function()
{
	for (var i = 0; i < colourChoices.length; i++)
	{
		if (colourChoices[i] == colourChoice) 
		{
			if (i < colourChoices.length - 1) colourChoice = colourChoices[i + 1];
			else colourChoice = colourChoices[0];
			break;
		}
	}
}

var firerateButton = {hover: false, length: 60, height: 60, x: canvas.width * 0.625 - 30, y: canvas.height * 0.125 - 30};

firerateButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawText("Firerate", this.x + this.length / 2, this.y + this.height / 2, this.length);
	drawText("$" + FIRERATE_POWERUP_PRICE, this.x + this.length / 2, this.y + 15 + this.height / 2, this.length);
}

firerateButton.click = function()
{
	if (money >= FIRERATE_POWERUP_PRICE)
	{
		money -= FIRERATE_POWERUP_PRICE;
		fireratePowerupTimer.val = FIRERATE_POWERUP_DURATION;
	}
}

var bombPowerupButton = {hover: false, length: 60, height: 60, x: canvas.width * 0.475 - 30, y: canvas.height * 0.125 - 30};

bombPowerupButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawText("No Bombs", this.x + this.length / 2, this.y + this.height / 2, this.length);
	drawText("$" + BOMB_POWERUP_PRICE, this.x + this.length / 2, this.y + 15 + this.height / 2, this.length);
}

bombPowerupButton.click = function()
{
	if (money >= BOMB_POWERUP_PRICE) 
	{
		money -= BOMB_POWERUP_PRICE;
		bombPowerupTimer.val = BOMB_POWERUP_DURATION;
	}
}

var shieldButton = {hover: false, length: 60, height: 60, x: canvas.width * 0.775 - 30, y: canvas.height * 0.125 - 30};

shieldButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawText("Shield", this.x + this.length / 2, this.y + this.height / 2, this.length);
	drawText("$" + SHIELD_PRICE, this.x + this.length / 2, this.y + 15 + this.height / 2, this.length);
}

shieldButton.click = function()
{
	if (money >= SHIELD_PRICE)
	{
		money -= SHIELD_PRICE;
		shieldTimer.val = SHIELD_DURATION;
	}
}

var bulletPowerupButton = {hover: false, length: 60, height: 60, x: canvas.width * 0.325 - 30, y: canvas.height * 0.125 - 30};

bulletPowerupButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawText("Large Bullets", this.x + this.length / 2, this.y + this.height / 2, this.length);
	drawText("$" + BULLET_POWERUP_PRICE, this.x + this.length / 2, this.y + 15 + this.height / 2, this.length);
}

bulletPowerupButton.click = function()
{
	if (money >= BULLET_POWERUP_PRICE)
	{
		money -= BULLET_POWERUP_PRICE;
		bulletPowerupTimer.val = BULLET_POWERUP_DURATION;
	}
}

var doubleLivesButton = {hover: false, length: 60, height: 60, x: canvas.width * 0.925 - 30, y: canvas.height * 0.125 - 30};

doubleLivesButton.render = function()
{
	if (this.hover) drawRect(this.x, this.y, this.length, this.height, "#006699");
	else drawRect(this.x, this.y, this.length, this.height, "#6699FF");
	drawText("x2 Lives", this.x + this.length / 2, this.y + this.height / 2, this.length);
	drawText("$" + DOUBLE_LIVES_PRICE * lives, this.x + this.length / 2, this.y + 15 + this.height / 2, this.length);
}

doubleLivesButton.click = function()
{
	if (money >= DOUBLE_LIVES_PRICE * lives)
	{
		money -= DOUBLE_LIVES_PRICE * lives;
		lives *= 2;
	}
}

menuButtons.push(shieldButton);
menuButtons.push(colourButton);
menuButtons.push(unpauseButton);
menuButtons.push(mouseControlButton);
menuButtons.push(firerateButton);
menuButtons.push(bombPowerupButton);
menuButtons.push(bulletPowerupButton);
menuButtons.push(doubleLivesButton);


function pauseLoop() //Called by main loop when paused
{
	//Draw giant pause icon 
	drawRect(canvas.width * 0.45 - 10, canvas.height / 4, 20, canvas.height / 2, "#000000");
	drawRect(canvas.width * 0.55 - 10, canvas.height / 4, 20, canvas.height / 2, "#000000");
	drawText("Power-ups:", canvas.width * 0.15, canvas.height * 0.15); // "Power Ups:" text
	
	//Draw buttons and register mouse clicks on them
	if (mouseClicks.length > 0)
	{
		for (var i = 0; i < mouseClicks.length; i++)
		{
			var registeredClick = false;
			var click = mouseClicks[i];
			for (var i2 = 0; i2 < menuButtons.length; i2++)
			{
				var but = menuButtons[i2];
				if (!registeredClick && click.x >= but.x && click.x <= but.x + but.length && click.y >= but.y && click.y <= but.y + but.height)
				{
					but.hover = true;
					registeredClick = true;
					but.click();
					but.render();
					continue;
				}
				//Check for curor hovering over button
				if (mouseX >= but.x && mouseX <= but.x + but.length && mouseY >= but.y && mouseY <= but.y + but.height)
				{
					but.hover = true;
				}
				else but.hover = false;
				but.render();
			}
		}
		mouseClicks.splice(0, mouseClicks.length);
	}
	else		
	{
		for (var i = 0; i < menuButtons.length; i++)
		{
			var but = menuButtons[i];
			if (mouseX >= but.x && mouseX <= but.x + but.length && mouseY >= but.y && mouseY <= but.y + but.height)
			{
				but.hover = true;
			}
			else but.hover = false;
			but.render();
		}
	}	
}
