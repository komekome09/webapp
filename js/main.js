// define
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var PIC_SIZE = 16;
// function
var createCrashSprite = function(x, y){
	var sprite = tm.app.AnimationSprite(96, 128, ss);
	sprite.position.set(x, y);
	sprite.gotoAndPlay("run");
	sprite.blendMode = "lighter";

	return sprite;
};
// img
var ASSETS = {
	"ground": "pic/grd.png",
	"hardle": "pic/hardle.png"
};
var ss = tm.app.SpriteSheet({
	image: "pic/run.png",
	frame: {
		width: 32,
		height: 64,
		count: 6
	},
	animations: {
		"run": [0, 5, "run"],
	}
});
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
		var animationSprite = createAnimationSprite(100, SCREEN_HEIGHT /4 * 3 - 64);
		this.addChild(animationSprite);

		this.posX = 0;
		this.posY = SCREEN_HEIGHT / 4 * 3;
		for(var y = this.posY; this.posY <= (SCREEN_HEIGHT + (PIC_SIZE * 3)); this.posY += PIC_SIZE){
			for(var x = this.posX; this.posX <= (SCREEN_WIDTH + (PIC_SIZE * 3)); this.posX += PIC_SIZE){
				this.setSprite("ground", PIC_SIZE, PIC_SIZE, this.posX, this.posY, this.grdGroup);
			}
			this.posX = 0;
		}

		this.fromJSON(UI_DATA.main);
	},

	update: function(app){
		var time = ((app.frame / app.fps) * 1000) | 0;
		var timeStr = "" + this.interval + " : " + app.frame;//"Score : " + time + "";

		if(app.frame >= this.interval){
			this.posX = SCREEN_WIDTH + (PIC_SIZE * 2);
			this.posY = (SCREEN_HEIGHT / 4 * 3) - PIC_SIZE;
			this.setSprite("hardle", PIC_SIZE, PIC_SIZE, this.posX, this.posY, this.hardleGroup);
			this.setInterval(100, 200, app);
		}

		this.hardleGroup.children.each( function(i){
			i.x -= 3;
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
