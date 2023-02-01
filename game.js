var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: arcade,
        arcade: {
            gravity: { y: 5 },
            debug: false
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let enemy;
let cursors;
let bgm;
let enter;
let shot;
let xSpeed = 0;
let ySpeed = 0;
let enemyXSpeed = 1;
let enemyYSpeed = 1;
const ACCEL = 8;
let enemyAccel = 4;
let accuracy = 50;
let score = 0;
let scoreText = "";
let timerText = "";
let timer = 0;
let interval;
let gameover = false;

function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.audio('shotsound', 'assets/shot.mp3');
    this.load.audio('bgm', 'assets/ditto.mp3');
    this.load.spritesheet('enemy', 'assets/enemy.png', {frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 100, frameHeight: 100})
}

function create () {
    this.add.image(400, 300, 'background');
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    timerText = this.add.text(600, 16, 'timer: 0', {fontSize: '32px', fill: '#000'});

    enemy = this.physics.add.sprite(200, 150, 'enemy');
    enemy.setCollideWorldBounds(true);
    player = this.physics.add.sprite(400, 300, 'crosshair');
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorsKeys();
    enter = this.input.keyboard.addKey(phaser.Input.Keyboard.KeyCodes.ENTER);
    shot = this.sound.add('shot');
    bgm = this.sound.add('bgm');

    this.anims.create({
        key: 'main',
        frames: this.anims.generateFrameNumbers('enemy', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('enemy', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1
    });

    enemy.anims.play('main', true);
    bgm.play();

    interval = setInterval(function(){
        timer += 1;
        timerText.setText('timer: ' + timer);
        if (timer >= 61) {
            gameover = true;
            endGame();
        }
    }, 1000);
}

function update() {
    if (gameover) {
        return;
    }

    // enemy movement
    if (enemy.x >= 750) {
        enemy.x = 749;
        enemyXSpeed = enemyXSpeed * (-1);
        enemy.setVelocityX(enemyXSpeed);
    } else {
        enemy.x = enemy.x + enemyXSpeed;
    }

    if (enemy.x <= 50) {
        enemy.x = 51;
        enemyXSpeed = enemyXSpeed * (-1);
        enemy.setVelocityX(enemyXSpeed);
    } else {
        enemy.x = enemy.x + enemyXSpeed;
    }

    if (enemy.y >= 550) {
        enemy.y = 549;
        enemyYSpeed = enemyYSpeed * (-1);
        enemy.setVelocityY(enemyYSpeed);
    } else {
        enemy.y = enemy.y + enemyYSpeed;
    }

    if (enemy.y <= 50) {
        enemy.y = 51;
        enemyYSpeed = enemyYSpeed * (-1);
        enemy.setVelocityY(enemyYSpeed);
    } else {
        enemy.y = enemy.y + enemyYSpeed;
    }

    // player cursor movement
    if (cursors.left.isDown) {
        xSpeed = xSpeed - ACCEL;
        player.setVelocityX(xSpeed);
    } 
    if (cursors.right.isDown) {
        xSpeed = xSpeed + ACCEL;
        player.setVelocityX(xSpeed);
    }
    if(cursors.up.isDown) {
        ySpeed = ySpeed - ACCEL;
        player.setVelocityY(ySpeed);
    }
    if (cursors.down.isDown) {
        ySpeed = ySpeed + ACCEL;
        player.setVelocityY(ySpeed);
    }

    if (Phaser.Input.Keyboard.JustDown(enter)) {
        shot.play();
        if (Math.abs(player.x - enemy.x) < accuracy && Math.abs(player.y - enemy.y) < accuracy) {
            hit();
        } else {
            miss();
        }
    }
}

function hit() {
    score += 10;
    scoreText.setText('score: ' + score); 

    // restore enemy
    enemy.on('animationcomplete', function(){
        enemy.anims.play('main', true);
        resetPlayer();
    });
    enemy.anims.play('explode', true);
}

function miss() {
    score = score - 1;
    scoreText.setText('score: ' + score);
}

function resetPlayer() {
    player.x = 400;
    player.y = 300;
    player.setVelocityX(0);
    player.setVelocityY(0);
    xSpeed = 0;
    ySpeed = 0;
}

function endGame() {
    enemy.destroy();
    player.destroy();
    timerText.setText('');
    clearInterval(interval);
}

let game = new Phaser.Game(config);