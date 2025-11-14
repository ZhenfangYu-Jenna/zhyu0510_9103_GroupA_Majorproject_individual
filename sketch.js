// ===== Music & Amplitude Analysis =====
let song;        // music file
let amplitude;   // overall volume analysis (amplitude)

// Realtime volume & pan
let volume = 1.0; 
let pan    = 0.0; 

// Global angle that drives halo animation
let animAngle = 0;

// ===== Visual Variables =====
let bg;                // background color
let colorSet;          // color palette
let rings = [];        // parameters for each ring

function preload() {
  song = loadSound('music.mp3');
}

// Press SPACE to play or pause
function keyPressed() {
  if (key === ' ') {
    userStartAudio();  // audio unlock

    if (!song.isPlaying()) {
      song.loop();
      song.setVolume(volume);
      song.pan(pan);
    } else {
      song.pause();
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  colorSet = [
    color(10,13,24),     // bg
    color(255, 90, 0),   // hot orange
    color(255, 0, 110),  // magenta
    color(80, 220, 100), // mint
    color(255, 200, 0),  // yellow
    color(0, 210, 255),  // cyan
    color(140,110,255),  // violet
    color(255, 80,170),  // pink
    color(255,120, 40),  // orange2
    color(40, 255,200)   // aqua
  ];
  bg = colorSet[0];

  // Overall volume analysis (amplitude)
  if (typeof p5.Amplitude !== 'undefined') {
    amplitude = new p5.Amplitude();
    amplitude.setInput(song);
  } else {
    amplitude = null;
  }

  generateLayout();
}

function draw() {
  background(bg);

  // === Halo enlarges with amplitude ===
  let ampFactor = 1.0;
  if (amplitude) {
    let level = amplitude.getLevel();             // 0 ~ 0.3 approx
    ampFactor = map(level, 0, 0.25, 0.5, 2.5);    // 0.5 ~ 2.5
    ampFactor = constrain(ampFactor, 0.5, 2.5);
  }

  // halo breathing timing
  animAngle += 0.05;

  for (let ring of rings) {
    // falling progress t (0 ~ 1), controls transparency
    const t = constrain((ring.y + ring.r) / (height + ring.r * 2), 0, 1);

    // halo: breathing controlled by amplitude
    drawAura(ring, t, ampFactor);

    // fixed main graphic
    if (ring.style === 'dots') {
      drawDotMandala(ring);
    } else {
      drawCircle(ring);
    }

    // falling & reset
    fallAndReset(ring);
  }

  // Display realtime Volume / Pan
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text('Volume: ' + volume.toFixed(2), 20, 20);
  text('Pan: ' + pan.toFixed(2), 20, 40);
}

// ===== Three-layer halo =====
function drawAura(ring, t, ampFactor) {
  if (t <= 0) return;

  // independent for each ring
  if (ring.phaseOffset === undefined) {
    ring.phaseOffset = random(TWO_PI);
  }

  // base breathing (slight scaling)
  const breathe = 1.0 + 0.3 * sin(animAngle + ring.phaseOffset);

  // base radius: original r × breathing × global amplitude
  const base = ring.r * breathe * (ampFactor || 1.0);

  // alpha fades with falling
  const alpha1 = map(t, 0, 1, 160, 0);  // inner
  const alpha2 = map(t, 0, 1, 100, 0);  // middle
  const alpha3 = map(t, 0, 1, 60,  0);  // outer

  noStroke();

  const c1 = ring.palette[1 % ring.palette.length];
  const c2 = ring.palette[2 % ring.palette.length];
  const c3 = ring.palette[3 % ring.palette.length];

  // outermost (largest, faintest)
  fill(red(c3), green(c3), blue(c3), alpha3);
  circle(ring.x, ring.y, base * 2.2);

  // middle
  fill(red(c2), green(c2), blue(c2), alpha2);
  circle(ring.x, ring.y, base * 1.7);

  // inner
  fill(red(c1), green(c1), blue(c1), alpha1);
  circle(ring.x, ring.y, base * 1.3);
}

// ===== Falling & Reset =====
function fallAndReset(ring) {
  ring.y += ring.vy;

  if (ring.y > height + ring.r) {
    ring.y = -ring.r;
    ring.x = random(ring.r, width - ring.r);
    ring.vy = random(1, 3);

    // reshuffle palette
    ring.palette = [
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
      random(colorSet.slice(1)),
    ];

    // reset phase
    ring.phaseOffset = random(TWO_PI);
  }
}

// ===== Generate ring layout =====
function generateLayout() {
  rings = [];
  const S = min(width, height);

  const N_SPOKES = 5;
  const N_DOTS   = 7;

  const Rmin_spokes = S * 0.06;
  const Rmax_spokes = S * 0.09;
  const Rmin_dots   = S * 0.05;
  const Rmax_dots   = S * 0.08;

  const pool = colorSet.slice(1);  // exclude bg

  // 1. spokes type
  for (let i = 0; i < N_SPOKES; i++) {
    let r = random(Rmin_spokes, Rmax_spokes);
    let x = random(r + 20, width  - r - 20);
    let y = random(-height, height);
    let vy = random(3.8, 4.5);
    let palette = [
      random(pool),
      random(pool),
      random(pool),
      random(pool),
      random(pool)
    ];
    rings.push({
      x, y, r, palette,
      style: 'spokes',
      vy,
      phaseOffset: random(TWO_PI)
    });
  }

  // 2. dots type
  for (let i = 0; i < N_DOTS; i++) {
    let r = random(Rmin_dots, Rmax_dots);
    let x = random(r + 20, width  - r - 20);
    let y = random(r + 20, height - r - 20);
    let vy = random(2.5, 3.5);
    let palette = [
      random(pool),
      random(pool),
      random(pool),
      random(pool),
      random(pool)
    ];
    rings.push({
      x, y, r, palette,
      style: 'dots',
      vy,
      phaseOffset: random(TWO_PI)
    });
  }
}

// ===== Resize window =====
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateLayout();
}

// ===== spokes-type ring =====
function drawCircle(ring) {
  // outer ring
  strokeWeight(max(2, ring.r * 0.08));
  stroke(ring.palette[0]);
  noFill();
  circle(ring.x, ring.y, ring.r * 2);

  // spokes
  let nSpokes = 15;
  strokeWeight(2);
  stroke(ring.palette[1]);

  for (let i = 0; i < nSpokes; i++) {
    let ang = i * TWO_PI / nSpokes;
    let x1 = ring.x + ring.r * 0.12 * cos(ang);
    let y1 = ring.y + ring.r * 0.12 * sin(ang);
    let x2 = ring.x + ring.r * 0.88 * cos(ang);
    let y2 = ring.y + ring.r * 0.88 * sin(ang);
    line(x1, y1, x2, y2);
  }

  // middle ring
  strokeWeight(max(2, ring.r * 0.04));
  stroke(ring.palette[2]);
  noFill();
  circle(ring.x, ring.y, ring.r * 1.2);

  // lattice A (outer ring)
  noStroke();
  fill(ring.palette[3]);
  let dotsA = max(7, int(ring.r / 5));
  let rA = ring.r * 0.38;

  for (let i = 0; i < dotsA; i++) {
    let a = i * TWO_PI / dotsA;
    let x = ring.x + rA * cos(a);
    let y = ring.y + rA * sin(a);
    circle(x, y, 7);
  }

  // lattice B (inner ring)
  noStroke();
  fill(ring.palette[1]);
  let dotsB = max(3, int(ring.r / 5));
  let rB = ring.r * 0.26;

  for (let i = 0; i < dotsB; i++) {
    let a = i * TWO_PI / dotsB;
    let x = ring.x + rB * cos(a);
    let y = ring.y + rB * sin(a);
    circle(x, y, 6);
  }

  // center cap
  noStroke();
  fill(ring.palette[4]);
  circle(ring.x, ring.y, ring.r * 0.24);
  fill(random(colorSet));
  circle(ring.x, ring.y, ring.r * 0.12);
}

// ===== dots-type ring =====
function drawDotMandala(ring) {

  // spokes
  let nSpokes = 8;
  strokeWeight(2);
  stroke(ring.palette[1]);

  for (let i = 0; i < nSpokes; i++) {
    let ang = i * TWO_PI / nSpokes;
    let x1 = ring.x + ring.r * 0.12 * cos(ang);
    let y1 = ring.y + ring.r * 0.12 * sin(ang);
    let x2 = ring.x + ring.r * 0.80 * cos(ang);
    let y2 = ring.y + ring.r * 0.80 * sin(ang);
    line(x1, y1, x2, y2);
  }

  // inner ring
  let n1 = 8;
  let r1 = ring.r * 0.22;
  let s1 = ring.r * 0.10;
  fill(ring.palette[2]);

  noStroke();
  for (let i = 0; i < n1; i++) {
    let a = i * TWO_PI / n1;
    let x = ring.x + r1 * cos(a);
    let y = ring.y + r1 * sin(a);
    circle(x, y, s1);
  }

  // middle ring
  let n2 = 19;
  let r2 = ring.r * 0.52;
  let s2 = ring.r * 0.08;
  fill(ring.palette[3]);

  for (let i = 0; i < n2; i++) {
    let a = i * TWO_PI / n2;
    let x = ring.x + r2 * cos(a);
    let y = ring.y + r2 * sin(a);
    circle(x, y, s2);
  }

  // outer ring
  let n3 = 24;
  let r3 = ring.r * 0.55;
  let s3 = ring.r * 0.09;
  fill(ring.palette[4]);

  for (let i = 0; i < n3; i++) {
    let a = i * TWO_PI / n3;
    let x = ring.x + r3 * cos(a);
    let y = ring.y + r3 * sin(a);
    circle(x, y, s3);
  }

  // center
  fill(ring.palette[0]);
  circle(ring.x, ring.y, ring.r * 0.20);
}

// ===== Mouse moves: realtime volume & pan =====
function mouseMoved() {
  if (!song) return;

  // map mouse Y to volume 0~1 (top loud, bottom quiet)
  volume = map(mouseY, 0, height, 1, 0, true);
  song.setVolume(volume);

  // map mouse X to panning -1~1 (left/right)
  pan = map(mouseX, 0, width, -1, 1, true);
  song.pan(pan);
}
