// Initialize Phaser, and create a 400 x 490 px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

// Create our 'main' state that will contain the game
var mainState = {

	preload: function () {
		// This function will be excuted at the beginning and where we load the assets.
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('bird', 'assets/bird.png');
		game.load.image('pipe', 'assets/pipe.png');

	},

	create: function () {
		// Here we set up the game, display sprites, etc.
		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Display the bird on screen
		this.bird = this.game.add.sprite(100, 245, 'bird');
		// Add gravity to the bird to make it fall
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;
		//Call the 'jump' function when the spacebar is hit
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);
		//Group feature in Phaser
		this.pipes = game.add.group();
		this.pipes.enableBody = true; // Add physics to the group
		this.pipes.createMultiple(20, 'pipe'); //Create 20 pipes
		//Add pipes on screen
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
		//Add a label for game score
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", {font: "40px Arial", fill: "#ffffff"});
	},

	update: function () {
		// This function is called 60 times per second
		// It contains the logic of how the game works
		if (this.bird.inWorld === false)
			this.restartGame();
		game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
	},

	jump: function () {
		this.bird.body.velocity.y = -350;
	},

	restartGame: function () {
		game.state.start('main');
	},

	addOnePipe: function (x, y) {
		var pipe = this.pipes.getFirstDead();
		pipe.reset(x,y);
		pipe.body.velocity.x = -200;

		// Kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},

	addRowOfPipes: function () {
		var hole = Math.floor(Math.random()*5) + 1;

		// Add 6 pipes
		for (var i = 0; i < 8 ; i ++)
			if (i != hole && i != hole +1)
				this.addOnePipe(400, i*60 + 10);

		// Add score
		this.score += 1;
		this.labelScore.text = this.score;
	},
};

// Add and start the 'main' state to begin
game.state.add('main', mainState);
game.state.start('main');