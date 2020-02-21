ModeScreen = class()

function ModeScreen:init()
    self.h = HEIGHT/#MODES
    self.blocks = {}
    for i = 1, #MODES do
        local y = (i/#MODES)*HEIGHT
        self.blocks[i] = {
        y = y-self.h/2,
        w = WIDTH-50,
        h = self.h-25
        }
    end
    self.tween = 1
end

function ModeScreen:draw()
    fill(0,50)
    font("HelveticaNeue-Light")
    fontSize(80)
    for k,v in ipairs(self.blocks) do
        if MODE == k then
            self.tween = self.tween-0.05
            if self.tween <= 0 then
                screen = GameScreen()
                bgcol = RandColor()
            end
            fill(0,50)
            rect(WIDTH/2,v.y,v.w,v.h*self.tween)
        else
            fill(0,50*self.tween)
            rect(WIDTH/2,v.y,v.w,v.h)
        end
        fill(255,255*self.tween)
        text(MODES[k],WIDTH/2,v.y)
    end
end

function ModeScreen:touched(touch)
    if touch.state == BEGAN and (not MODE) then
        for k,v in ipairs(self.blocks) do
            if touch.y > v.y-self.h/2 and touch.y < v.y+self.h/2 then
                MODE = k
                sound(SOUND_EXPLODE, 34)
            end
        end
    end
end
