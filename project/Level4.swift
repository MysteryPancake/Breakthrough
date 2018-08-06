//
//  Level4.swift
//  Breakthrough
//
//  Created by MysteryPancake on 22/5/17.
//  Copyright © 2017 MysteryPancake. All rights reserved.
//

import SpriteKit

final class Level4: LevelScene {
  
  private let fadeScale: CGFloat = 0.005
  private let cameraScale: CGFloat = 0.1
  private var currentTouch: UITouch?
  private var difference = CGVector()
  private var fade: CGFloat = 0
  private var playing = false
  
  override func didMove(to view: SKView) {
    
    spawnRect = CGRect(
      x: -frame.width,
      y: -frame.height,
      width: frame.width * 2,
      height: frame.height * 2
    )
    
    super.didMove(to: view)
    
    let intro = AudioManager.getMusic("Intro", level: 4)
    AudioManager.playLoop(intro!)
    let layer = AudioManager.getMusic("Layer", level: 4)
    AudioManager.musicLayer.scheduleBuffer(layer!, at: nil, options: .loops)
  }
  
  override func restartGame() {
    AudioManager.stopLayer()
    gameOver = true
  }
  
  private func touched(_ touch: UITouch) {
    let pos = touch.location(in: view)
    let center = view!.center
    difference = CGVector(dx: pos.x - center.x, dy: pos.y - center.y)
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    let touch = touches.first
    currentTouch = touch
    touched(touch!)
  }
  
  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
    let touch = touches.first
    currentTouch = touch
    touched(touch!)
  }
  
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    currentTouch = nil
    touched(touches.first!)
  }
  
  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
    currentTouch = nil
  }
  
  private func wrapBlocks() {
    
    let camPos = camera!.position
    
    for block in chosenBlocks {
      
      let blockPos = block.position
      
      let x = camPos.x - blockPos.x
      if x > spawnRect.width * 0.5 {
        block.position.x = blockPos.x + spawnRect.width
      } else if x < -spawnRect.width * 0.5 {
        block.position.x = blockPos.x - spawnRect.width
      }
      
      let y = camPos.y - blockPos.y
      if y > spawnRect.height * 0.5 {
        block.position.y = blockPos.y + spawnRect.height
      } else if y < -spawnRect.height * 0.5 {
        block.position.y = blockPos.y - spawnRect.height
      }
    }
  }
  
  private func playMain() {
    
    let music = AudioManager.getMusic("Main", level: 4)
    AudioManager.musicLayer.scheduleBuffer(music!, at: nil, options: [.interrupts, .loops])
    AudioManager.musicLayer.volume = 1
    AudioManager.stopLoop()
    
    backgroundColor = .white
    
    let white = SKAction.colorize(with: .white, colorBlendFactor: 1, duration: 0)
    for block in chosenBlocks {
      let random = SKAction.colorize(with: .randomHue, colorBlendFactor: 1, duration: 1)
      block.run(.sequence([white, random]))
    }
  }
  
  override func update(_ currentTime: TimeInterval) {
    
    if currentTouch != nil {
      fade = min(fade + fadeScale, 1)
      killTouchedBlocks(currentTouch!)
    } else {
      fade = max(fade - fadeScale, 0)
    }
    
    let distance: CGFloat = sqrt((difference.dx * difference.dx) + (difference.dy * difference.dy)) / (frame.maxSize * 0.4)
    camera?.position.x += difference.dx * distance * fade * cameraScale
    camera?.position.y -= difference.dy * distance * fade * cameraScale
    
    wrapBlocks()
    
    guard !playing else { return }
    
    let scale: CGFloat = distance * fade
    if scale > 1 {
      playMain()
      playing = true
    } else {
      AudioManager.musicLayer.volume = Float(scale)
    }
  }
}
