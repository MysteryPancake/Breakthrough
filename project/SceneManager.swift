//
//  SceneManager.swift
//  Breakthrough
//
//  Created by MysteryPancake on 2/7/17.
//  Copyright © 2017 MysteryPancake. All rights reserved.
//

import SpriteKit

struct SceneManager {
  
  static private var view: SKView!
  static private var currentLevel: Int {
    get {
      return UserDefaults.standard.integer(forKey: "Level")
    }
    set {
      UserDefaults.standard.set(newValue, forKey: "Level")
      UserDefaults.standard.synchronize()
    }
  }
  
  enum SceneIndentifier {
    case intro, menu, score(Int), level(Int), nextLevel
  }
  
  static func setView(_ view: SKView) {
    self.view = view
    transition(to: .intro)
  }
  
  static private func getScene(_ scene: SceneIndentifier) -> SKScene {
    
    let levels: [LevelScene] = [Level0(), Level1(), Level2(), Level3(), Level4(), Level5(), Level6()]
    
    switch scene {
    case .intro:
      let newScene = Level0()
      view.isMultipleTouchEnabled = true
      return newScene
      
    case .menu:
      let newScene = MenuScene()
      view.isMultipleTouchEnabled = false
      return newScene
      
    case .score(let number):
      let newScene = ScoreScene()
      newScene.score = number
      view.isMultipleTouchEnabled = false
      return newScene
      
    case .level(let number):
      currentLevel = number
      let newScene = levels[number]
      view.isMultipleTouchEnabled = true
      return newScene
      
    case .nextLevel:
      let next = currentLevel + 1
      if next >= levels.count {
        UserDefaults.standard.set(true, forKey: "Menu")
        UserDefaults.standard.synchronize()
        return getScene(.menu)
      } else {
        currentLevel = next
        let newScene = levels[next]
        view.isMultipleTouchEnabled = true
        return newScene
      }
    }
  }
  
  static func transition(to scene: SceneIndentifier) {
    
    let newScene = getScene(scene)
    newScene.backgroundColor = blockColor
    newScene.size = view.bounds.size
    newScene.scaleMode = .aspectFill
    
    let transition = SKTransition.crossFade(withDuration: 0.5)
    transition.pausesIncomingScene = false
    transition.pausesOutgoingScene = false
    view.presentScene(newScene, transition: transition)
  }
}
