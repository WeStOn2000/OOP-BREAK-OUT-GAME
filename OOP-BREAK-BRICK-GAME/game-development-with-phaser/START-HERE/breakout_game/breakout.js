const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    scale: {
      mode: Phaser.Scale.FIT,
    },
    scene: {
      preload,
      create,
      update,
    },
    physics:{
        default: 'arcade',
        arcade:{
            gravity:false,
            
        }
    }
  }

  new Phaser.Game(config);

  let paddle;
  let keys;
  let ball;
  let hasBallLaunched = false;
  let gameOverText;
  let YouWinText;
  let brickGroups;
  let pingBrick;
  let startText;


  const BALL_SPEED = 400;
  const PADDLE_SPEED = 300;

  function preload(){
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('brick', 'assets/brick.png');
    this.load.audio('ping_paddle','assets/ping_paddle.mp3');
    this.load.audio('ping_brick','assets/ping_brick.mp3');
    this.load.audio('ping_wall','assets/ping_wall.mp3');
  }
  function create(){
    const{width: screenWidth , height : screenHeight} = config;
    const brickGroupYValues = [200,140,80];
    
    paddle = this.physics.add.image(screenWidth / 2,screenHeight -50, 'paddle');
    paddle.setCollideWorldBounds();
    paddle.setImmovable();

    keys = this.input.keyboard.createCursorKeys();
    
    ball = this.physics.add.image(screenWidth / 2, screenHeight -90, 'ball');
   ball.setCollideWorldBounds(true,1,1,true);
   ball.setBounce(1);

  const pingPaddle = this.sound.add('ping_paddle');
    pingBrick = this.sound.add('ping_brick');
  const pingWall = this.sound.add('ping_wall');

   this.physics.add.collider(ball,paddle,() => pingPaddle.play());
   this.physics.world.checkCollision.down = false;
   this.physics.world.on('worldbounds', () => {pingWall.play()});
   brickGroups = brickGroupYValues.map((yValue) => { 
    const brickGroup = this.physics.add.group({
        key:'brick',
        repeat: 8,
        immovable: true,
        setXY:{
            x: 155,
            y: yValue,
            stepX: 120
        }
    });
    this.physics.add.collider(ball, brickGroup ,hitBrick);
   return brickGroup;

}); 
   gameOverText = this.add.text(screenWidth / 2, screenHeight /2, "Game over",{ fontSize: '50px'})
   gameOverText.setOrigin(); 
   gameOverText.setVisible(false);

   YouWinText = this.add.text(screenWidth / 2, screenHeight /2, "You Win!!",{ fontSize: '50px'})
   YouWinText.setOrigin(); 
   YouWinText.setVisible(false);

   startText = this.add.text(
    screenHeight / 1.1 ,
    screenWidth / 3,
    'Use ⬅️ and ➡️ to move paddle\nPress SPACE to start game!!!',
    {
      fontSize :'30px',
      alignText : 'Centre',
      lineSpacing: 10,
    }
   );
   startText.setOrigin();
  }
  function update(){
    paddle.setVelocityX(0);
    if(keys.left.isDown){
    paddle.setVelocityX(-PADDLE_SPEED);
    }
    if(keys.right.isDown){
      paddle.setVelocityX(PADDLE_SPEED);
    }
    if(!hasBallLaunched){
        ball.x = paddle.x;
        if(keys.space.isDown){
          startText.setVisible(false);
    ball.setVelocityY(-BALL_SPEED);
    hasBallLaunched = true;
        }
  }
  if(ball.body.y > this.physics.world.bounds.bottom){
     this.scene.pause();
     gameOverText.setVisible(true);
  }
const activeBrickCount = brickGroups.reduce((acc, brickGroup) => acc + brickGroup.countActive(), 0);

if(activeBrickCount === 0){
    YouWinText.setVisible(true);
    this.scene.pause();

}
  }
 
function hitBrick(_ball,brick){
    if(ball.body.velocity.x === 0){
        ball.setVelocityX(150);
    }
    pingBrick.play();
brick.destroy();
}
  