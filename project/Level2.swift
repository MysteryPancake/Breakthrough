//
//  Level2.swift
//  Breakthrough
//
//  Created by MysteryPancake on 29/10/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import SpriteKit

final class Level2: LevelScene {

  private var label = SKLabelNode(fontNamed: mainFont)
  private var setTime: TimeInterval!
  private var drawTime = TimeInterval()
  
  override func didMove(to view: SKView) {
    
    super.didMove(to: view)

    label.fontColor = .white
    label.fontSize = frame.width * 0.075
    label.position = CGPoint(x: 0, y: frame.maxY - 24)
    label.horizontalAlignmentMode = .center
    label.verticalAlignmentMode = .top
    camera?.addChild(label)
    
    let timed = AudioManager.getMusic("Timed", level: 2)
    AudioManager.playMusic(timed!)
  }
  
  private func getTimerString(_ time: TimeInterval) -> String {
    let ti = Int(time)
    let minutes = (ti / 60) % 60
    let seconds = (ti % 60)
    let ms = Int(time.truncatingRemainder(dividingBy: 1) * 1000)
    return String(format: "%0.2d:%0.2d:%0.3d", minutes, seconds, ms)
  }
  
  override func update(_ time: TimeInterval) {
    
    guard !gameOver else { return }
    
    if setTime == nil { setTime = time + 60 }
    drawTime = setTime - time
    
    if drawTime <= 0 {
      gameOver = true
    } else {
      label.text = getTimerString(drawTime)
    }
  }
}
