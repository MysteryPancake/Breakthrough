//
//  Level0.swift
//  Breakthrough
//
//  Created by MysteryPancake on 3/7/17.
//  Copyright © 2017 MysteryPancake. All rights reserved.
//

import SpriteKit

final class Level0: LevelScene {
  
  override func restartGame() {
    
    blockColor = backgroundColor
    
    if UserDefaults.standard.bool(forKey: "Menu") {
      SceneManager.transition(to: .menu)
    } else {
      let currentLevel = UserDefaults.standard.integer(forKey: "Level")
      SceneManager.transition(to: .level(currentLevel))
    }
  }
}
