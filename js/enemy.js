var genTimer = 700;

function createEnemy(group, sprite, dir, fixedX, fixedY){
  var e = group.getFirstDead();
  if(e != null){
    e.reset(0,0);
  }
  else{
    e = group.create(0, 0, sprite);
    e.anchor.setTo(.5, .5);
    if(sprite == "enemy1"){
      e.body.setSize(25, 25, 0, 1);
    }
    else if(sprite == "enemy2"){
      e.body.setSize(30,30,0,0);
    }
  }
  if(sprite == "enemy1"){
    e.health = 1;
  }
  else if(sprite == "enemy2"){
    e.health = 2;
  }
  var spread = Math.random() * Math.PI - (Math.PI/2);
  var a = 0;
  var speed = 150;
  if(dir == "left"){
    //subtract half of width + 1
    e.x = -1 * e.body.width/2 + 10;
    if(Math.random() > .75){
      a = spread;
    }
    if(fixedY){e.y = fixedY;}
    else{
      e.y = Math.random() * (game.world.height - 100) + 50;
    }

  }
  else if(dir == "right"){
    e.x = game.world.width - e.body.width/2 - 10;
    if(Math.random() > .75){
      a = spread + Math.PI;
    }
    else{
      a = Math.PI;
    }
    if(fixedY){e.y = fixedY;}
    else{
      e.y = Math.random() * (game.world.height - 100) + 50;
    }
  }
  else if(dir == "top"){
    e.y = -1 * e.body.height/2 + 10;
    if(Math.random() > .75){
      a = spread + (1/2 * Math.PI);
    }
    else{
      a = Math.PI / 2;
    }
    if(fixedX){e.x = fixedX;}
    else{
      e.x = Math.random() * (game.world.width - 100) + 50;
    }
  }
  else if(dir == "bottom"){
    e.y = game.world.height + e.body.height/2 - 10;
    if(Math.random() > .75){
      a = spread + (3/2 * Math.PI);
    }
    else{
      a = Math.PI * 3/2;
    }
    if(fixedX){e.x = fixedX;}
    else{
      e.x = Math.random() * (game.world.width - 100) + 50;
    }
  }

  e.body.velocity.x = Math.cos(a) * speed;
  e.body.velocity.y = Math.sin(a) * speed;
  e.angle = a * (180/Math.PI);
  e.hasEntered = false;//custom property
  
}

function killOutOfBoundEnemies(){
  e1.forEachAlive(function(e){
    if(e.x + e.width/2 < 0 || e.x - e.width/2 > game.world.width || e.y + e.height/2 < 0 || e.y - e.height/2 > game.world.height){
      e.kill();
    }
  });
}

function onEnemyHit(enemy, bullet){
  bullet.kill();
  enemy.health -= 1;
  if(enemy.health <= 0){
    enemy.kill();
    //create explosion
    emitters[enemy.key].x = enemy.x;
    emitters[enemy.key].y = enemy.y;
    emitters[enemy.key].start(true, 500, 0, 15);
  }
  else{
    return;
  }
  feedback.score += 1;
  feedback.num_hit += 1;
  if(Math.random() > .8){
    //create diamond drop
    var d = diamonds.getFirstDead();
    if(d){
      //reset
      d.reset(enemy.body.x, enemy.body.y);
    }
    else{
      d = diamonds.create(enemy.body.x + enemy.body.width/2, enemy.body.y + enemy.body.height/2, "diamond");
      d.anchor.setTo(.5, .5);
      d.body.setSize(20, 20);
    }

  }
}


function enemyGen(){
  var dir = ["left", "right", "top", "bottom"];
  genTimer -= game.time.elapsed;
  if(genTimer <= 0){
    //create enemy
    var r = Math.random();
    if(level > 1){
      if(r > .5){
        createEnemy(e1, "enemy1", dir[Math.floor(Math.random() * dir.length)]);
      }
      else{
        createEnemy(e2, "enemy2", dir[Math.floor(Math.random() * dir.length)]);
      }
    }
    else{
      createEnemy(e1, "enemy1", dir[Math.floor(Math.random() * dir.length)]);
    }
    if(Math.random() < .05){
      //special move
      //diamond formation enemy 1
      var sdir = "top";
      var startX = Math.random() * (game.world.width - 175);
      var startY = null;
      if(Math.random() > .5){
        sdir = "left";
        startX = null;
        startY = Math.random() * (game.world.height - 175);
      }
      
      for(var i = 0; i < 10; i++){
        createEnemy(e1, "enemy1", sdir, startX, startY);
        if(sdir == "top"){
          startX += 30;
        }
        else if(sdir == "left"){
          startY += 30;
        }
      }
    }
    genTimer = 750 - (level * 50);
  }
}