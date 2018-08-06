//
//  Level5.swift
//  Breakthrough
//
//  Created by MysteryPancake on 7/6/17.
//  Copyright © 2017 MysteryPancake. All rights reserved.
//

import SpriteKit

final class Level5: Level1 {
  
  private let fadeScale: CGFloat = 0.005
  private let cameraScale: CGFloat = 0.1
  private var currentTouch: UITouch?
  private var difference = CGVector()
  private var fade: CGFloat = 0
  
  override func didMove(to view: SKView) {
    
    initialCount = 2
    bridgeAfter = 3
    level = 5
    
    spawnRect = CGRect(
      x: -frame.width,
      y: -frame.height,
      width: frame.width * 2,
      height: frame.height * 2
    )
    
    super.didMove(to: view)
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
    
    for block in children {
      
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
  
  override func getAppropriateBlock() -> SKSpriteNode? {
    return badBlocks.random
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
  }
}
