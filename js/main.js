// define
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var PIC_SIZE = 32;
var BLANK_NUM = 3;
var Y_VELO = 10;
var SPEED = 8;
var SPRITE_X = 32;
var SPRITE_Y = 64;
var SPRITE_POS = SCREEN_HEIGHT / 4 * 3 - SPRITE_Y + 16;
// function
var createAnimationSprite = function(x, y, ss){
	var sprite = tm.app.AnimationSprite(ss, SPRITE_X, SPRITE_Y);
	sprite.position.set(x, y);
	sprite.gotoAndPlay("run");

	return sprite;
};
var ss_run = tm.asset.SpriteSheet({
	image: "pic/sprite_run.png",
	frame: {
		width: SPRITE_X,
		height: SPRITE_Y,
		count: 8
	},
	animations: {
		"run": [0, 6, "run", 3],
		"jump": {
			frames: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
			next: "run",
			frequency: 1,
		},
	}
});
var ss_down = tm.asset.SpriteSheet({
	image: "pic/sprite_down.png",
	frame: {
		width: 64,
		height: 32,
		count: 2
	},
	animations: {
		"down": [0, 2, "down", 1000],
	}
});
// img
var ASSETS = {
	"ground": "pic/grd.png",
	"hardle": "pic/hardle.png"
};
// textLabel
var UI_DATA = {
	main: {
		children: [{
			type: "Label",
			name: "mainLabel",
			x: 30,
			y: 50,
			fillStyle: "white",
			text: " ",
			fontSize: 40,
			align: "left"
		}]
	}
};

// main	
tm.main(function(){
	// make canvas
	var app = tm.app.CanvasApp("#world");
	app.resizeWindow();
	app.fitWindow();
	app.background = "rgba(144, 215, 236, 1.0)";

	var loadingScene = tm.app.LoadingScene({
		assets: ASSETS,
		nextScene: titleScene,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	});

	app.replaceScene(loadingScene);

	app.run();
});

// titleScene
tm.define("titleScene", {
	superClass: tm.app.TitleScene,

	init: function(){
		this.superInit({
			title: "PRESS BUTTON",
			width: SCREEN_WIDTH,
			height: SCREEN_HEIGHT
		});
	},

	update: function(){
		var key = this.app.keyboard;
		if(key.getKeyDown("z")){
			this.app.replaceScene(gameScene());
		}
	},
});

// gameScene
tm.define("gameScene", {
	superClass: tm.app.Scene,

	init: function(){
		this.superInit();

		this.hardleGroup = tm.app.CanvasElement().addChildTo(this);
		this.grdGroup = tm.app.CanvasElement().addChildTo(this);
		this.interval = Math.rand(10, 100);
		this.animationSprite = createAnimationSprite(100, SPRITE_POS, ss_run);
		this.addChild(this.animationSprite);
		this.jump_v = Y_VELO;
		this.jump_flag = false;

		this.posX = 0;
		this.posY = SCREEN_HEIGHT / 4 * 3;
		for(var y = this.posY; this.posY <= SCREEN_HEIGHT; this.posY += PIC_SIZE){
			for(var x = this.posX; this.posX <= (SCREEN_WIDTH + (PIC_SIZE * BLANK_NUM)); this.posX += PIC_SIZE){
				this.setSprite("ground", PIC_SIZE, PIC_SIZE, this.posX, this.posY, this.grdGroup);
			}
			this.posX = 0;
		}

		this.fromJSON(UI_DATA.main);
	},

	update: function(app){
		var time = ((app.frame / app.fps) * 1000) | 0;
		var timeStr = "Score : " + ((time / 100) | 0) + "";
		var key = this.app.keyboard;

		if(key.getKey("z")){
			if(this.jump_flag == false){
				this.animationSprite.gotoAndPlay("jump");
			}
			this.jump_flag = true;
		}
		
		if(this.jump_flag){
			this.animationSprite.y -= this.jump_v;
			this.jump_v--;
			if(this.animationSprite.y >= SPRITE_POS){
				this.animationSprite.y = SPRITE_POS;
				this.jump_v = Y_VELO;
				this.jump_flag = false;
			}
		}

		if(app.frame >= this.interval){
			this.posX = SCREEN_WIDTH + (PIC_SIZE * BLANK_NUM);
			this.posY = (SCREEN_HEIGHT / 4 * 3) - PIC_SIZE;
			this.setSprite("hardle", PIC_SIZE, PIC_SIZE, this.posX, this.posY, this.hardleGroup);
			this.setInterval(10, 100, app);
		}

		this.hardleGroup.children.each( function(i){
			i.x -= SPEED;
		});
		
		this.grdGroup.children.each( function(i){
			i.x -= SPEED;
			if(i.x <= -PIC_SIZE){
				i.x = SCREEN_WIDTH + (PIC_SIZE * (BLANK_NUM - 1));
			}
		});

		this.mainLabel.text = timeStr;
	},

	setInterval: function(a, b, app){
		this.interval = Math.rand(a, b) + app.frame;
	},

	setSprite: function(identifier, rangeX, rangeY, posX, posY, childTo){
		var sprite = tm.app.Sprite(identifier, rangeX, rangeY).addChildTo(childTo);
		sprite.position.set(posX, posY);
	},
});

// resultScene
tm.define("resultScene", {
	superClass: tm.app.ResultScene,

	init: function(){
		this.superInit();
	},
});
