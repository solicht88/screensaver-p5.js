let merriweather;
let kirbyImageTwo;
let kirbyFrames = [];
let fallingSnow = [];
let timeUntilNewSnow = 5;
let snowToRemove = false;

// load font + images
function preload() {
  merriweather = loadFont("Merriweather-Regular.ttf");
  kirbyImageTwo = loadImage("kirbySprites/kirbyWalk2.png")

  // adds kirby images to array 
  kirbyFrames.push(
    loadImage("kirbySprites/kirbyWalk1.png")
  );
  kirbyFrames.push(kirbyImageTwo);
  kirbyFrames.push(
    loadImage("kirbySprites/kirbyWalk3.png")
  );
  kirbyFrames.push(kirbyImageTwo);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
  rectMode(CENTER);

  // custom object to animate kirby walking
  kirbyWalk = {
    xValue: -150,
    yValue: height-120,
    frame: 0,
    // kirby walking animation
    walk(speed) {
      this.xValue += speed
      this.frame += 1
    },
    // resets animation
    reset() {
      this.xValue = -150
      this.frame = 0
    }
  };
  
  // Creates first snowflake
  newSnow();

  // Setup sky as image (background)
  let sky = createImage(width, height);
  sky.loadPixels();
  for (let x = 0; x < sky.width; x++) {
    for (let y = 0; y < sky.height; y++) {
      pixelColour = color(0, 0, y/(height/100));
      sky.set(x, y, pixelColour)
    }
  }
  sky.updatePixels();

  // Create bg graphic: sky + street + street light pole
  bg = createGraphics(width, height);
  bg.noStroke();
  bg.image(sky, 0, 0);
  // street light pole
  bg.fill(75, 65, 55);
  bg.rect(width*4/5, height/5, 10, height*4/5);
  bg.rect(width*2/3, height/5, width*2/15, 10);
  // street
  bg.fill(100, 100, 100);
  bg.rect(0, height-40, width, 40);
}

function draw() {
  clear();
  
  // Draws background
  image(bg, 0, 0);

  // Draws kirby walking
  image(kirbyFrames[kirbyWalk.frame % 4], kirbyWalk.xValue, kirbyWalk.yValue);
  kirbyWalk.walk(5);
  // Resets animation when kirby exits the screen
  if (kirbyWalk.xValue > width + 150) {
    kirbyWalk.reset();
  }
  
  // Draws falling snowflakes
  for (let s of fallingSnow) {
    stroke(1);
    fill(245);
    rect(s.xValue, s.yValue, 5);
    s.fall(5);
    // Prepares to remove snowflake after reaching ground
    if (s.yValue > height-40) {
      snowToRemove = true;
    }
  }
  // Removes snowflake that has reached the ground
  if (snowToRemove) {
    fallingSnow.splice(0, 1);
    snowToRemove = false;
  }

  // Makes a new snowflake every 5 frames
  if (timeUntilNewSnow == 0) {
    newSnow();
    timeUntilNewSnow = 5;
  } else {
    timeUntilNewSnow -= 1;
  }

  // Draws light from street light pole
  noStroke();
  fill(255, 200, 100, 150);
  triangle(width*2/3, height/5+10, width/2, height-35, width*5/6, height-35);
  
  // Name displayed in corner of canvas
  fill(255);
  noStroke();
  textFont(merriweather, 14);
  text("sunflwrs (Amy Z)", 12, height-12);
}

// Creates a new snowflake at random x position and pushes to fallingSnow array
function newSnow() {
  let snow = {
    xValue: random(width),
    yValue: 0,
    fall(speed) {
      this.yValue += speed
    }
  };
  fallingSnow.push(snow);
}