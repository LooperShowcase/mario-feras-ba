kaboom({
  global: true,
  fullscreen: true,
  // rgb :o,255 ,caboom:0,1 alpha :0,1
  clearColor: [0.32, 0.74, 0.2, 0.65],
  // load sprite(NAEM-OF-OBJECT,'FILE'),
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mario", "mario2.png");
loadSprite("block", "ground.png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSound("gamesound", "gameSound.mp3");
loadSound("jumpsound", "jumpSound.mp3");
loadSprite("pipe","pipe_up.png")
loadSprite("castle","castle.png")
scene ("gg",(score)=> {
  add ([
    text("gg you win\n \n Score:"+score+ " ",20),
  pos(width()/2,height()/2),
    origin("center"),
  ]);
})
scene ("game over",(score) => {
  add([
    text("came over \n Score:"+score+ "you are nooooooood", 20 ),
    pos(width()/2,height()/2),
    origin("center")
  ])
  keyRelease("enter", () => {
    go("start")
  });
})
scene('start',()=>{
  add([
    text("welcom to the game\n press enter to start",25),
    origin ("center"),
    pos(width()/2,height()/2),
   
  ])
  keyRelease("enter", () => {
    go("game")
  });
})

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gamesound");
  const symbolMap = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(),scale(1.3)],
    $: [sprite("coin"), "coin"],
    "!": [sprite("surprise"), solid(), "surprise-mushroom"],
    "?": [sprite("surprise"), solid(), "suprise-coin"],
    "@": [sprite("unboxed"), solid()],
    M: [sprite("mushroom"),body(), "mushroom"],
    "^":[sprite("goomba"),body(),solid(),"goomba"],
    'P': [sprite ('pipe'),solid(),("pipe")],
    'K':[sprite('castle'),scale(2)]
  };

  const map = [
    "                                                                             ",
    "    =              =====           ====       ==                             ",
    "    =            =       =       =      =     =  =                           ",
    "    =            =       =       =      =     =   =                          ",
    "    =            =       =       =      =     ====                           ",
    "    =            =       =       =      =     =                              ",
    "    =========      =====           ====       =                              ",
    "                                                                             ",
    "                                                                             ",
    "                                                                             ",
    "                                                                     K       ",
    "                                                                             ",
    "                                                                             ",
    "                                                        ======!==            ", 
    "            ==?=                                                             ",
    "                                                                             ",
    "                                     ==!=====                                ",
    "                              ^      ^        ^                              ",
    "==================================================== ========================",
    "==================================================== ========================",
    "==================================================== ========================",
  ];
  const level = addLevel(map, symbolMap);
  const jumpForce = 500;
  const player = add([
    sprite("mario"),
    solid(),
    pos(50, 0),
    body(),
    origin("bot"),
    big(jumpForce),
  ]);
  const speed = 170;
  let isJamping=false;
  let score=0
  const scoreLabel = add([
    text("score:"+score),
    pos(50,10),
    layer("ui"),
    {
    value:score ,
    },
  ]);

  keyDown("left", () => {
    if (player.pos.x > 10) {
      player.move(-speed, 0);
    }
  });

  keyDown("right", () => {
    player.move(speed, 0);
  });

  
   
  keyDown("up", () => {
    if (player.grounded()) {
      player.jump(jumpForce);
      isJamping=true;

    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("suprise-coin")) {
      level.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      level.spawn("@", obj.gridPos);
    }
    if (obj.is("surprise-mushroom")) {
      level.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      level.spawn("@", obj.gridPos);
    }
  });

  player.collides("coin", (x) => {
    destroy(x);
    scoreLabel.value+=1;
    scoreLabel.text="Score: "+scoreLabel.value;

  });

  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(20);
    scoreLabel.value+=10;
    scoreLabel.text="Score: "+scoreLabel.value;

  });

player.collides("goomba",(x) => {
if(isJamping){
  destroy(x)
  scoreLabel.value+=100;
    scoreLabel.text="Score: "+scoreLabel.value;

} else{
  if(player.isBig()){
    destroy (x)
    player.smallify();
  }else {
    go ("game over",scoreLabel.value)
    destroy(player)
  }

  }
})

  action("mushroom", (mushy) => {
    mushy.move(50,0)
  })
  let gomaSpeed=50
  action("goomba",(gg)=> {
    gg.move(-gomaSpeed,0)
    loop(5,()=>{
      gomaSpeed=gomaSpeed*-1
    })
  })
  player.action(() => {
    camPos(player.pos.x, 175);
    scoreLabel.pos.x=player.pos.x-400;
    if(player.pos.x>=1458.0360500000024)
    go("gg",scoreLabel.value)
    if(player.grounded()){
      isJamping=false;
    } else {
      isJamping=true;
    }
    if(player.pos.y>=height()){
      go('game over',scoreLabel.value)
    }
  });
});
start("start");
