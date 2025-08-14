let config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);


function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

let bird;
let hasLanded = false;
let hasBumped = false;
let cursors;
let isGameStarted = false;
let messageToPlayer;
let hasWon = false;

function create () {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    const roads = this.physics.add.staticGroup();

    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: { x: 200, y: 0, stepX: 300 }
    });

    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: { x: 350, y: 400, stepX: 300 },
    });

    const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setCollideWorldBounds(true);

    this.physics.add.collider(bird, road, () => (hasLanded = true), null, this);
    this.physics.add.collider(bird, topColumns, () => (hasBumped = true), null, this);
    this.physics.add.collider(bird, bottomColumns, () => (hasBumped = true), null, this);

    cursors = this.input.keyboard.createCursorKeys();

    messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);
}

function update () {
    if (!isGameStarted) {
        bird.body.setAllowGravity(false);
    }

    if (!isGameStarted && Phaser.Input.Keyboard.JustDown(cursors.space)) {
        isGameStarted = true;
        bird.body.setAllowGravity(true);
        bird.setVelocityY(-150);
        messageToPlayer.text = 'Instructions: Tap space to flap\nAvoid the columns and ground';
    }

    if (isGameStarted && !hasLanded && !hasBumped && Phaser.Input.Keyboard.JustDown(cursors.space)) {
        bird.setVelocityY(-150);
    }

    if (isGameStarted && !hasLanded && !hasBumped && !hasWon) {
        bird.setVelocityX(50);
    } else {
        bird.setVelocityX(0);
    }

    if (bird.x > 750 && !hasWon) {
        hasWon = true;
    }

    if (hasWon) {
        bird.setVelocity(0, 0);
        bird.body.setAllowGravity(false);
        messageToPlayer.text = `Congrats! You won!`;
        return;
    }

    if (hasLanded || hasBumped) {
        bird.setVelocity(0, 0);
        bird.body.setAllowGravity(false);
        messageToPlayer.text = `Oh no! You crashed!`;
        return;
    }
}