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


  const BALL_SPEED = 400;

  function preload(){
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('brick', 'assets/brick.png');
  }
  function create(){
    const{width: screenWidth , height : screenHeight} = config;
    const brickGroupYValues = [200,140,80];
    
    paddle = this.physics.add.image(screenWidth / 2,screenHeight -50, 'paddle');
    paddle.setCollideWorldBounds();
    paddle.setImmovable();

    keys = this.input.keyboard.createCursorKeys();
    
    ball = this.physics.add.image(screenWidth / 2, screenHeight -90, 'ball');
   ball.setCollideWorldBounds();
   ball.setBounce(1);
   this.physics.add.collider(ball,paddle);
   this.physics.world.checkCollision.down = false;
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
  }
  function update(){
    if(keys.left.isDown){
     paddle.x = paddle.x -5
    }
    if(keys.right.isDown){
     paddle.x = paddle.x +5
    }
    if(!hasBallLaunched){
        ball.x = paddle.x;
        if(keys.space.isDown){
    ball.setVelocityY(-BALL_SPEED);
    hasBallLaunched = true;
        }
  }
  if(ball.body.y > paddle.body.y){
     this.scene.pause();
     gameOverText.setVisible(true);
  }
//const activeBrickCount = brickGroups.reduce((acc, brickGroup) => acc + brickGroup.countActive(), 0);

/*if(activeBrickCount === 26){
    YouWinText.setVisible(true);
    this.scene.pause();
}*/
}
 
function hitBrick(_ball,brick){
    if(ball.body.velocity.x === 0){
        ball.setVelocityX(150);
    }
brick.destroy();
}