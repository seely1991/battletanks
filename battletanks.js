//create money system
//random doesn't reset with every function
//drill stops randomly
//clean up code

//gets how many hills, need to let it accept inputs from user
let numberOfHills = Math.floor(Math.random()*5)+1;

//this array will ultimately become the contour of the hills
let lineHeights = [];

//abbreviations to recall canvas info and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//x coordinate of players 1 and 2, set randomly
const x1 = (Math.floor(Math.random() * ((canvas.width / 2) - 40)) + 20);
const x2 = canvas.width - (Math.floor(Math.random() * ((canvas.width / 2) - 40)) + 20);

//remembers power and angle of turret from previous turn;
let rememberedt1 = x1 + 17;
let rememberedt2 = x2 - 17;
let rememberedV1 = 50;
let rememberedV2 = 50;

//will be used to execute commands based on button presses
let rightPressed = false;
let leftPressed = false;
let returnPressed = false;
let upPressed = false;
let downPressed = false;

//messy way I programmed the ability to switch between takes each turn
let PlayerXcor = x1;
let PlayerOppcor = x2;

//x coordinate of the end of the turret
let t = x1 + 17;

//location of the bullet as it moves (values are added by 1 once shoot() is triggered)

let bulletX = x1 + 17;
let bulletX1 = 0;
let randomBulletX = x1 + 17;
let randomStart = PlayerXcor + 17;
let bulletXDrill = x1 + 17;

//sets power, changes based on up or down
let velocity = 50;

//how big the blast is, need to make drop down list before game starts
let blastRadius = 40;

//crude way to switch turns
let player1Turn = true;

//player 1 and 2 money amounts
let money1 = 1000;
let money2 = 1000;

//gets button presses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  } else if (e.keyCode === 13) {
    returnPressed = true;
  } else if (e.keyCode === 38) {
    upPressed = true;
  } else if (e.keyCode === 40) {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  } else if (e.keyCode === 38) {
    upPressed = false;
  } else if (e.keyCode === 40) {
    downPressed = false;
  }
}

//generates the random heights of the hills and uses the sin function to fill out the lineHeights array
for (l = 0; l < numberOfHills; l += 1) {
  let hilltop = Math.floor(Math.random() * 300) + 20;
  for (h = 0; h < canvas.width / numberOfHills; h++) {
    let setPhase = (canvas.width / (numberOfHills)) / (2 * Math.PI);
    let sCurve = hilltop / 2 + hilltop / 2 * (Math.sin((h / (setPhase)) - (Math.PI / 2)));

    lineHeights.push(sCurve+90);
  }
}

//draws the hills based on lineHeights
function drawLandscape(color) {
  for (d = 0; d < canvas.width; d++) {
    ctx.beginPath();
    ctx.moveTo(d, canvas.height);
    ctx.lineTo(d, canvas.height - lineHeights[d]);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
}


//the y position of tank1
let center1 = canvas.height + 4 - lineHeights[x1];

//function used to dynamically create position of turret
const turretAngle = (l1,center) => {
  return (center - 7) - Math.sqrt(576 - Math.pow((l1 - (PlayerXcor)), 2));
}

function drawTank1() {
  ctx.beginPath();
  if (player1Turn===true) {
  ctx.moveTo(x1, center1 - 7);
  ctx.lineWidth = 3;
  ctx.lineTo(t, turretAngle(t,center1));
  ctx.strokeStyle = "silver";
  ctx.stroke();
  }else{
  ctx.moveTo(x1, center1 - 2);
  ctx.lineWidth = 3;
  ctx.lineTo(x1+22, center1 - 22);
  ctx.strokeStyle = "silver";
  ctx.stroke();
  }
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(x1, center1, 15, Math.PI, Math.PI * 2, false);
  ctx.fillStyle = "gray";
  ctx.fill();
  ctx.closePath();
}

let center2 = canvas.height + 4 - lineHeights[x2];

function drawTank2() {
  ctx.beginPath();
  if (player1Turn===false) {
  ctx.moveTo(x2, center2 - 7);
  ctx.lineWidth = 3;
  ctx.lineTo(t, turretAngle(t,center2));
  ctx.strokeStyle = "gray";
  ctx.stroke();
  }else{
  ctx.moveTo(x2, center2 - 2);
  ctx.lineWidth = 3;
  ctx.lineTo(x2-22, center2 -22);
  ctx.strokeStyle = "gray";
  ctx.stroke();
  }
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(x2, center2, 15, Math.PI, Math.PI * 2, false);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

//sets initial values for player1
let shooter = center1;
let explosion1 = false;
let explosion2 = false;
let explosion3 = false;
let drillExplosion = false;

//random shot function
function randomShot(center, vel) {
  const projectile = (vx, vy) => {
    let t0 = bulletX1 / ((vel / 100) * 8 * vx);
    return turretAngle(t,center) - (-16 * Math.pow(t0, 2) + (vel / 100) * 8 * vy * (t0));
  };
  let bulletHeight = Math.round(projectile((t - PlayerXcor), -(turretAngle(t,center) - center + 7))) +Math.floor(Math.random()*11)-3;
  function explosion() {
    explosion1=true;
    ctx.beginPath();
    ctx.moveTo(randomBulletX + 21,bulletHeight + 12);
    ctx.lineTo(randomBulletX, bulletHeight - 24);
    ctx.lineTo(randomBulletX -21, bulletHeight + 17);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(randomBulletX+10,bulletHeight -20);
    ctx.lineTo(randomBulletX - 15, bulletHeight - 15);
    ctx.lineTo(randomBulletX, bulletHeight + 24);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(randomBulletX -20,bulletHeight);
    ctx.lineTo(randomBulletX + 15, bulletHeight - 13);
    ctx.lineTo(randomBulletX +13, bulletHeight +20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(randomBulletX -15,bulletHeight);
    ctx.lineTo(randomBulletX -5, bulletHeight - 3);
    ctx.lineTo(randomBulletX -9, bulletHeight -8);
    ctx.lineTo(randomBulletX -2,bulletHeight -3);
    ctx.lineTo(randomBulletX, bulletHeight - 18);
    ctx.lineTo(randomBulletX +5, bulletHeight -5);
    ctx.lineTo(randomBulletX + 15,bulletHeight-16);
    ctx.lineTo(randomBulletX + 15, bulletHeight + 11);
    ctx.lineTo(randomBulletX + 5, bulletHeight + 5);
    ctx.lineTo(randomBulletX + 11,bulletHeight + 15);
    ctx.lineTo(randomBulletX + 2, bulletHeight + 6);
    ctx.lineTo(randomBulletX, bulletHeight +5);
    ctx.lineTo(randomBulletX-5, bulletHeight +3);
    ctx.lineTo(randomBulletX -15,bulletHeight);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    if (t - PlayerXcor > 0) {
    bulletX -= 1;
    bulletX1 -= 1;
    }else {
    bulletX += 1;
    bulletX1 += 1;
    }
  }
  ctx.beginPath();
  ctx.arc(randomBulletX, bulletHeight, 2, 0, Math.PI*2);
  ctx.fillStyle = "rgba(256,256,256,.6)";
  ctx.fill();
  ctx.closePath();
  if (t - PlayerXcor > 0) {
    randomBulletX += Math.floor(Math.random()*10)
    bulletX += 1;
    bulletX1 += 1;
    }else {
      randomBulletX -= Math.floor(Math.random()*10)
    bulletX -= 1;
    bulletX1 -= 1;
    }
    //checks if it hit the tank
  if (bulletHeight > canvas.height - lineHeights[PlayerOppcor] -10 && bulletHeight < canvas.height - lineHeights[PlayerOppcor] + 10 && randomBulletX < PlayerOppcor +5+ blastRadius/2 && randomBulletX > PlayerOppcor +5 - blastRadius/2){
    document.getElementById("myCanvas").style.background = "#2F2F2F";
    
    //explosion;
    drawLandscape("#6D6D6D");
    explosion();
    clearInterval(intervalId);
    setTimeout(function () {
      returnPressed = false;
    if (player1Turn === true) {alert("player 1 wins")};
    if (player1Turn === false) {alert("player 2 wins")};
    location.reload();
    },1500)
    
 //check if it hits the landscape or out of bounds
  }else if (bulletHeight > canvas.height - lineHeights[randomBulletX] || randomBulletX > canvas.width || randomBulletX < 0) { 
  
    
    //explosion
    explosion();
    //changes the landscape to reflect radius of explosion
    for (k=0;k<2*blastRadius+1;k++) {
      let newValue =canvas.height- (bulletHeight + Math.sqrt(blastRadius*blastRadius - Math.pow(((k+randomBulletX-blastRadius) - (randomBulletX)), 2)));
      if (newValue < lineHeights[randomBulletX-blastRadius+k]) {
      lineHeights.splice(randomBulletX-blastRadius+k,1,newValue);
      }
      
    }
    
    //stops drawing the bullet
      setTimeout(function () {

        returnPressed = false
    //prepares variables for player 2
    if (player1Turn === true) {
    money1 +=200;
    rememberedV1 = velocity;
    velocity = rememberedV2;
    bulletX1 = 0;
    rememberedt1 = t;
    t = rememberedt2;
    bulletX = rememberedt2;
    randomBulletX = rememberedt2;
    PlayerXcor = x2;
    PlayerOppcor = x1;
    shooter = center2;
    player1Turn = false;
    
    //prepares variables for player 1
    }else{
    money2 += 200;
    rememberedV2 = velocity;
    velocity = rememberedV1;
    bulletX1 = 0;
    rememberedt2 = t;
    t = rememberedt1;
    bulletX = rememberedt1;
    randomBulletX = rememberedt1;
    PlayerXcor = x1;
    PlayerOppcor = x2;
    shooter = center1;
    player1Turn = true;
    }
    explosion1 = false;
    explosion2 = false;
    explosion3 = false;
      },500)
    
    
  }

}

//function used to draw the bullet for each frame using projectile motion equation
function shoot(center, vel, explosionNum, last) {
  const projectile = (vx, vy) => {
    let t0 = bulletX1 / ((vel / 100) * 8 * vx);
    return turretAngle(t,center) - (-16 * Math.pow(t0, 2) + (vel / 100) * 8 * vy * (t0));
  };
  let bulletHeight = Math.round(projectile((t - PlayerXcor), -(turretAngle(t,center) - center + 7)));
  function explosion() {
    if (explosionNum === 1) {explosion1 = true};
    if (explosionNum === 2) {explosion2 = true};
    if (explosionNum === 3) {explosion3 = true};
    ctx.beginPath();
    ctx.moveTo(bulletX + 21,bulletHeight + 12);
    ctx.lineTo(bulletX, bulletHeight - 24);
    ctx.lineTo(bulletX -21, bulletHeight + 17);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(bulletX+10,bulletHeight -20);
    ctx.lineTo(bulletX - 15, bulletHeight - 15);
    ctx.lineTo(bulletX, bulletHeight + 24);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(bulletX -20,bulletHeight);
    ctx.lineTo(bulletX + 15, bulletHeight - 13);
    ctx.lineTo(bulletX +13, bulletHeight +20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(bulletX -15,bulletHeight);
    ctx.lineTo(bulletX -5, bulletHeight - 3);
    ctx.lineTo(bulletX -9, bulletHeight -8);
    ctx.lineTo(bulletX -2,bulletHeight -3);
    ctx.lineTo(bulletX, bulletHeight - 18);
    ctx.lineTo(bulletX +5, bulletHeight -5);
    ctx.lineTo(bulletX + 15,bulletHeight-16);
    ctx.lineTo(bulletX + 15, bulletHeight + 11);
    ctx.lineTo(bulletX + 5, bulletHeight + 5);
    ctx.lineTo(bulletX + 11,bulletHeight + 15);
    ctx.lineTo(bulletX + 2, bulletHeight + 6);
    ctx.lineTo(bulletX, bulletHeight +5);
    ctx.lineTo(bulletX-5, bulletHeight +3);
    ctx.lineTo(bulletX -15,bulletHeight);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    if (t - PlayerXcor > 0) {
    bulletX -= 1;
    bulletX1 -= 1;
    }else {
    bulletX += 1;
    bulletX1 += 1;
    }
  }
  
  ctx.beginPath();
  ctx.arc(bulletX, bulletHeight, 2, 0, Math.PI*2);
  ctx.fillStyle = "rgba(256,256,256,.6)";
  ctx.fill();
  ctx.closePath();
  if (t - PlayerXcor > 0) {
    bulletX += 1;
    bulletX1 += 1;
    }else {
    bulletX -= 1;
    bulletX1 -= 1;
    }

  
  //checks if it hit the tank
  if ((bulletHeight > canvas.height - lineHeights[PlayerOppcor] -10 && bulletHeight < canvas.height - lineHeights[PlayerOppcor] + 10) && bulletX < PlayerOppcor +5+ blastRadius/2 && bulletX > PlayerOppcor +5 - blastRadius/2){
    document.getElementById("myCanvas").style.background = "#2F2F2F";
    
    //explosion;
    drawLandscape("#6D6D6D");
    explosion();
    clearInterval(intervalId);
    setTimeout(function () {
      returnPressed = false;
    if (player1Turn === true) {alert("player 1 wins")};
    if (player1Turn === false) {alert("player 2 wins")};
    location.reload();
    },1500)
    
 //check if it hits the landscape or out of bounds
  }else if (bulletHeight > canvas.height - lineHeights[bulletX] || bulletX > canvas.width || bulletX < 0) {	
  
    
    //explosion
  	explosion();
    //changes the landscape to reflect radius of explosion
    for (k=0;k<2*blastRadius+1;k++) {
      let newValue =canvas.height- (bulletHeight + Math.sqrt(blastRadius*blastRadius - Math.pow(((k+bulletX-blastRadius) - (bulletX)), 2)));
      if (newValue < lineHeights[bulletX-blastRadius+k]) {
      lineHeights.splice(bulletX-blastRadius+k,1,newValue);
      }
      
    }
    
    //stops drawing the bullet
    if (last === true) {
      setTimeout(function () {

      returnPressed = false
    //prepares variables for player 2
    if (player1Turn === true) {
    if (document.getElementById("atomBomb").checked === true) {blastRadius = 40; money1 -= 1300};
    if (explosionNum === 2) {money1 -= 200};
    if (explosionNum === 3) {money1 -= 500};
    money1 -= 200;
    rememberedV1 = velocity;
    velocity = rememberedV2;
    bulletX1 = 0;
    rememberedt1 = t;
    t = rememberedt2;
    bulletX = rememberedt2;
    randomBulletX = rememberedt2;
    PlayerXcor = x2;
    PlayerOppcor = x1;
    shooter = center2;
    player1Turn = false;
    
    //prepares variables for player 1
    }else{
    if (document.getElementById("atomBomb").checked === true) {blastRadius = 40; money2 -= 1300}
    if (explosionNum === 2) {money2 -= 200};
    if (explosionNum === 3) {money2 -= 500};
    money2 -= 200;
    rememberedV2 = velocity;
    velocity = rememberedV1;
    bulletX1 = 0;
    rememberedt2 = t;
    t = rememberedt1;
    bulletX = rememberedt1;
    randomBulletX = rememberedt1;
    PlayerXcor = x1;
    PlayerOppcor = x2;
    shooter = center1;
    player1Turn = true;
    }
    explosion1 = false;
    explosion2 = false;
    explosion3 = false;
      },500)
    
    }
  }

  
  //determines if bullet goes left or right based on turret position  
}

function shootDrill(center, vel, explosionNum, last) {
  blastRadius = 20;
  drillExplosion = false;
  const projectile = (vx, vy) => {
    let t0 = bulletX1 / ((vel / 100) * 8 * vx);
    return turretAngle(t,center) - (-16 * Math.pow(t0, 2) + (vel / 100) * 8 * vy * (t0));
  };
  let bulletHeight = Math.round(projectile((t - PlayerXcor), -(turretAngle(t,center) - center + 7)));
  function explosion() {
    ctx.beginPath();
    ctx.moveTo(bulletX + 21,bulletHeight + 12);
    ctx.lineTo(bulletX, bulletHeight - 24);
    ctx.lineTo(bulletX -21, bulletHeight + 17);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(bulletX+10,bulletHeight -20);
    ctx.lineTo(bulletX - 15, bulletHeight - 15);
    ctx.lineTo(bulletX, bulletHeight + 24);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(bulletX -20,bulletHeight);
    ctx.lineTo(bulletX + 15, bulletHeight - 13);
    ctx.lineTo(bulletX +13, bulletHeight +20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(bulletX -15,bulletHeight);
    ctx.lineTo(bulletX -5, bulletHeight - 3);
    ctx.lineTo(bulletX -9, bulletHeight -8);
    ctx.lineTo(bulletX -2,bulletHeight -3);
    ctx.lineTo(bulletX, bulletHeight - 18);
    ctx.lineTo(bulletX +5, bulletHeight -5);
    ctx.lineTo(bulletX + 15,bulletHeight-16);
    ctx.lineTo(bulletX + 15, bulletHeight + 11);
    ctx.lineTo(bulletX + 5, bulletHeight + 5);
    ctx.lineTo(bulletX + 11,bulletHeight + 15);
    ctx.lineTo(bulletX + 2, bulletHeight + 6);
    ctx.lineTo(bulletX, bulletHeight +5);
    ctx.lineTo(bulletX-5, bulletHeight +3);
    ctx.lineTo(bulletX -15,bulletHeight);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    if (t - PlayerXcor > 0) {
    bulletX -= 1;
    bulletX1 -= 1;
    }else {
    bulletX += 1;
    bulletX1 += 1;
    }
  }
  
  ctx.beginPath();
  ctx.arc(bulletX, bulletHeight, 2, 0, Math.PI*2);
  ctx.fillStyle = "rgba(256,256,256,.6)";
  ctx.fill();
  ctx.closePath();
  if (t - PlayerXcor > 0) {
    bulletX += 1;
    bulletX1 += 1;
    }else {
    bulletX -= 1;
    bulletX1 -= 1;
    }

  
  //checks if it hit the tank
  if ((bulletHeight > canvas.height - lineHeights[PlayerOppcor] -10 && bulletHeight < canvas.height - lineHeights[PlayerOppcor] + 10) && bulletX < PlayerOppcor +5+ blastRadius/2 && bulletX > PlayerOppcor +5 - blastRadius/2){
    document.getElementById("myCanvas").style.background = "#2F2F2F";
    
    //explosion;
    drawLandscape("#6D6D6D");
    explosion();
    clearInterval(intervalId);
    setTimeout(function () {
      returnPressed = false;
    if (player1Turn === true) {alert("player 1 wins")};
    if (player1Turn === false) {alert("player 2 wins")};
    location.reload();
    },1500)
    
 //check if it hits the landscape or out of bounds
  }else if (bulletHeight > canvas.height - lineHeights[bulletX] || bulletX > canvas.width || bulletX < 0) { 
  
    
    //explosion
    explosion();
    //changes the landscape to reflect radius of explosion
    for (k=0;k<2*blastRadius+1;k++) {
      let newValue =canvas.height- (bulletHeight + Math.sqrt(blastRadius*blastRadius - Math.pow(((k+bulletX-blastRadius) - (bulletX)), 2)));
      if (newValue < lineHeights[bulletX-blastRadius+k]) {
      lineHeights.splice(bulletX-blastRadius+k,1,newValue);
      }
      
    }
    if (bulletHeight > canvas.height -  60) {
      returnPressed = false
            //prepares variables for player 2
            drillExplosion = true;
            if (player1Turn === true) {
            money1 -= 300;
            rememberedV1 = velocity;
            velocity = rememberedV2;
            bulletX1 = 0;
            rememberedt1 = t;
            t = rememberedt2;
            bulletX = rememberedt2;
            PlayerXcor = x2;
            PlayerOppcor = x1;
            shooter = center2;
            player1Turn = false;
            
            //prepares variables for player 1
            }else{
            money2 -= 300;
            rememberedV2 = velocity;
            velocity = rememberedV1;
            bulletX1 = 0;
            rememberedt2 = t;
            t = rememberedt1;
            bulletX = rememberedt1;
            PlayerXcor = x1;
            PlayerOppcor = x2;
            shooter = center1;
            player1Turn = true;
            }
            explosion1 = false;
            explosion2 = false;
            explosion3 = false;
            blastRadius = 40;
    }
    //stops drawing the bullet
      setTimeout(function () {
        if (drillExplosion === false)
        {returnPressed = false
            //prepares variables for player 2
            drillExplosion = true;
            if (player1Turn === true) {
            rememberedV1 = velocity;
            velocity = rememberedV2;
            bulletX1 = 0;
            rememberedt1 = t;
            t = rememberedt2;
            bulletX = rememberedt2;
            randomBulletX = rememberedt2;
            PlayerXcor = x2;
            PlayerOppcor = x1;
            shooter = center2;
            player1Turn = false;
            
            //prepares variables for player 1
            }else{
            rememberedV2 = velocity;
            velocity = rememberedV1;
            bulletX1 = 0;
            rememberedt2 = t;
            t = rememberedt1;
            bulletX = rememberedt1;
            randomBulletX = rememberedt1;
            PlayerXcor = x1;
            PlayerOppcor = x2;
            shooter = center1;
            player1Turn = true;
            }
            explosion1 = false;
            explosion2 = false;
            explosion3 = false;
            blastRadius = 40;
              }},2700)
          
    }
  }

  
  //determines if bullet goes left or right based on turret position  

  

//function to be executed during each interval
function draw() {

  document.getElementById("p1$").innerHTML = "Player 1: $" + money1;
  document.getElementById("p2$").innerHTML = "Player 2: $" + money2;

//displays velocity on screen as power
  document.getElementById("velocity").innerHTML = "power: " + Math.round(velocity) + "%";
  
  //refreshes landscape, not executed during shoot() to see the path of the bullet; optional if statement
  //if (returnPressed === false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //}
  
  //constantly refresh the landscape, taking into account divets from explosions
  drawLandscape("green");
  
  //changes tank position if ground gives out (so they aren't floating after an explosion)
  center1 = canvas.height + 4 - lineHeights[x1];
  center2 = canvas.height + 4 - lineHeights[x2];
  drawTank1();
  drawTank2();
  
  //conditions for when to use keyboard values to change dynamic variables
  if (leftPressed === true && t > PlayerXcor - 24 && returnPressed === false) {
    t --;
    bulletX --;
  } else if (rightPressed === true && t < PlayerXcor + 24 && returnPressed === false) {
    t ++;
    bulletX ++;
  }
  if (upPressed === true && velocity < 100 && returnPressed === false) {
    velocity += (3/4);
  } else if (downPressed === true && velocity > 0 && returnPressed === false) {
    velocity -= (3/4);
  }
  if ((player1Turn === true && money1 >=200 || player1Turn === false && money2 >= 200) && returnPressed === true && document.getElementById("normal").checked === true) {
    if (explosion1 === false){shoot(shooter,velocity, 1, true);}

  }
  else if ((player1Turn === true && money1 >=700 || player1Turn === false && money2 >= 700) && returnPressed === true && document.getElementById("triple").checked === true) {
    if (explosion1 === false){shoot(shooter,velocity, 1, false);}    
    if (explosion2 === false){shoot(shooter,velocity-5, 2, false);}
    if (explosion3 === false){shoot(shooter,velocity+5, 3, true);}
  }
  else if ((player1Turn === true && money1 >=400 || player1Turn === false && money2 >= 400) && returnPressed === true && document.getElementById("double").checked === true) {
    if (explosion1 === false) {
    shoot(shooter,velocity-2, 1, false);
  }
    if (explosion2 === false) {
    shoot(shooter,velocity+2, 2, true)
  }
  }
  else if ((player1Turn === true && money1 >=300 || player1Turn === false && money2 >= 300) && returnPressed === true && document.getElementById("drill").checked === true) {
    shootDrill(shooter,velocity), 1, true;
  }
  else if (returnPressed === true && document.getElementById("random").checked === true) {
    if (explosion1 === false) {randomShot(shooter,velocity)}
  }
  else if ((player1Turn === true && money1 >=1500 || player1Turn === false && money2 >= 1500) && returnPressed === true && document.getElementById("atomBomb").checked === true) {
    blastRadius = 250;
    if (explosion1 === false) {shoot(shooter,velocity, 1, true)}
  }
  else if (returnPressed === true) {
    if (explosion1 === false) {randomShot(shooter,velocity)}
  }
  }

//sets the interval for looping the draw function, not sure if var has to be set for clearInterval() to work
var intervalId = setInterval(draw, 1)