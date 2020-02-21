-- Now known as Breakthrough

MODES = { "Classic", "1 Minute", "1000 Block", "Freemode" }
GAMEOVER = false

function RandColor()
    return color(math.random(255),math.random(255),math.random(255))
end

function HSVToRGB(h, s, v)
  local r, g, b
  local i = math.floor(h * 6)
  local f = h * 6 - i;
  local p = v * (1 - s);
  local q = v * (1 - f * s);
  local t = v * (1 - (1 - f) * s);
  i = i % 6
  if i == 0 then r, g, b = v, t, p
  elseif i == 1 then r, g, b = q, v, p
  elseif i == 2 then r, g, b = p, v, t
  elseif i == 3 then r, g, b = p, q, v
  elseif i == 4 then r, g, b = t, p, v
  elseif i == 5 then r, g, b = v, p, q
  end
  return color(r * 255, g * 255, b * 255)
end

function setup()
    noSmooth()
    supportedOrientations(CurrentOrientation)
    displayMode(FULLSCREEN)
    textAlign(CENTER)
    textMode(CENTER)
    rectMode(CENTER)
    bgcol = RandColor()
    maincol = bgcol
    screen = ModeScreen()
end

function draw()
    background(bgcol)
    screen:draw()
end

function touched(touch)
    screen:touched(touch)
end