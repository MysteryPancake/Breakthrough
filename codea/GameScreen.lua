GameScreen = class()

function GameScreen:init()
    self.total = 0
    self:generate()
    if MODE == 1 then
        self.lives = 3
    elseif MODE == 2 then
        self.timer = ElapsedTime+61
    elseif MODE == 3 then
        self.timer = ElapsedTime
    end
end

function GameScreen:generate()
    local WMIN,WMAX = 150,100
    local HMIN,HMAX = 200,150
    math.randomseed(ElapsedTime+os.time())
    self.blocks = {}
    self.blockcount = 0
    local rndh = math.random(math.floor(HEIGHT/WMIN),math.floor(HEIGHT/WMAX))
    local h = HEIGHT/rndh
    for i = 1, rndh do
        self.blocks[i] = {}
        local rndw = math.random(math.floor(WIDTH/HMIN),math.floor(WIDTH/HMAX))
        for j = 1, rndw do
            local w = WIDTH/rndw
            self.blocks[i][j] = {
            x = j/rndw*WIDTH-w/2,
            y = i/rndh*HEIGHT-h/2,
            w = w,
            h = h,
            }
            if MODE == 1 and math.random(20) == 1 then
                self.blocks[i][j].bad = true
            else
                self.blockcount = self.blockcount+1
            end
        end
    end
end

function GameScreen:draw()
    
    if MODE ~= 1 then
        fill(maincol)
    end
    
    for _,v in pairs(self.blocks) do
        for k,t in pairs(v) do
            if MODE == 1 then
                fill(t.bad and (t.kill and 255 or HSVToRGB(t.x+(ElapsedTime/10),1,1)) or maincol)
            end
            rect(t.x,t.y,t.w,t.h)
            if t.kill then
                t.w, t.h = t.w-8, t.h-8
                if t.w < 0 or t.h < 0 then
                    v[k] = nil
                    self.blockcount = self.blockcount-1
                    if self.blockcount == 0 then
                        self:generate()
                        maincol = bgcol
                        bgcol = RandColor()
                        if MODE ~= 4 then
                            sound(SOUND_PICKUP, 36)
                        end
                    end
                end
            end
        end
    end
    
    fill(255)
    font("HelveticaNeue-Light")
    fontSize(50)
    if MODE == 1 then
        text(self.lives,WIDTH/2,HEIGHT-50)
        text(self.total,WIDTH/2,50)
        if self.lives <= 0 then
            self:gameOver()
        end
    elseif MODE == 2 then
        text(self:getTimer(math.max(0,self.timer-ElapsedTime)),WIDTH/2,HEIGHT-50)
        text(self.total,WIDTH/2,50)
        if self.timer-ElapsedTime <= 0 then
            self:gameOver()
        end
    elseif MODE == 3 then
        text(self:getTimer(ElapsedTime-self.timer),WIDTH/2,HEIGHT-50)
        text(1000-self.total,WIDTH/2,50)
        if 1000-self.total <= 0 then
            self:gameOver()
        end
    end
    
    if GAMEOVER then self:drawGameOver() end
    
end

function GameScreen:gameOver()
    if GAMEOVER then return end
    GAMEOVER = true
    self.OVERTIME = ElapsedTime+2
    sound(SOUND_EXPLODE, 40)
end

function GameScreen:drawGameOver()
    font("AmericanTypewriter")
    fontSize(100)
    text("GAME OVER",WIDTH/2,HEIGHT/2)
    if self.OVERTIME < ElapsedTime then
        MODE = nil
        GAMEOVER = false
        bgcol = maincol
        screen = ModeScreen()
    end
end

function GameScreen:touched(touch)
    if GAMEOVER then return end
    for _,v in pairs(self.blocks) do
        for _,t in pairs(v) do
            if not t.kill then
                if touch.x < t.x+t.w/2 and touch.x > t.x-t.w/2 and touch.y < t.y+t.h/2 and touch.y > t.y-t.h/2 then
                    t.kill = true
                    if t.bad then
                        self.lives = self.lives-1
                        self.blockcount = self.blockcount+1
                        self.total = math.max(0,self.total-5)
                        sound(SOUND_EXPLODE, 58)
                    else
                        sound(SOUND_HIT, 107)
                        if MODE ~= 4 then self.total = self.total+1 end
                    end
                end
            end
        end
    end
end

function GameScreen:getTimer(seconds)
    if not seconds then return "" end
    local min,sec,milisec =  math.floor(seconds/60), math.floor(seconds)%60, math.floor(seconds*1000)%1000
    return string.format("%.1d:%.2d:%.2d",min,sec,milisec)
end