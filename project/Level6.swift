//
//  Level6.swift
//  Breakthrough
//
//  Created by MysteryPancake on 7/6/17.
//  Copyright © 2017 MysteryPancake. All rights reserved.
//

import SpriteKit

final class Level6: LevelScene {
  
  override func didMove(to view: SKView) {
    
    spawnRect = CGRect(
      x: -frame.width,
      y: -frame.height,
      width: frame.width * 2,
      height: frame.height * 2
    )
    
    super.didMove(to: view)
    
    let pinch = UIPinchGestureRecognizer(target: self, action: #selector(handlePinch))
    view.addGestureRecognizer(pinch)
    
    let music = AudioManager.getMusic("Main", level: 6)
    AudioManager.playLoop(music!)
  }
  
  override func restartGame() {
    AudioManager.stopLoop()
    gameOver = true
  }
  
  @objc func handlePinch(pinch: UIPinchGestureRecognizer) {
    let deltaScale = -pinch.scale + 2
    camera!.xScale = min(max(camera!.xScale * deltaScale, 0.5), 2)
    camera!.yScale = min(max(camera!.yScale * deltaScale, 0.5), 2)
    pinch.scale = 1
  }
}
