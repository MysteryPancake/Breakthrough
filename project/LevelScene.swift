//
//  LevelScene.swift
//  Breakthrough
//
//  Created by MysteryPancake on 26/9/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import SpriteKit

class LevelScene: SKScene {

  final var gameOver = false {
    didSet {
      if gameOver {
        blockColor = backgroundColor
        SceneManager.transition(to: .score(score))
      }
    }
  }
  final var score: Int = 0
  final var spawnRect: CGRect!
  final var interactive = true
  final var badBlocks: [SKSpriteNode] = []
  final var chosenBlocks: [SKSpriteNode] = []
  final private let sizeMin: CGFloat = 0.006
  final private let sizeMax: CGFloat = 0.01
  final private let heightBias: CGFloat = 1.25
  
  override func didMove(to view: SKView) {
    
    anchorPoint = CGPoint(x: 0.5, y: 0.5)
    
    if spawnRect == nil { spawnRect = frame }
    
    let cam = SKCameraNode()
    camera = cam
    addChild(cam)
    
    generateBlocks()
  }
  
  final private func generateBlocks() {
    
    badBlocks = []
    chosenBlocks = []
    
    blockColor = backgroundColor
    
    let heightCount: UInt32 = .random(
      min: UInt32(spawnRect.height * sizeMin * heightBias),
      max: UInt32(spawnRect.height * sizeMax * heightBias)
    )
    let height = spawnRect.height / CGFloat(heightCount)
    
    for j in 0..<heightCount {
      
      let widthCount: UInt32 = .random(
        min: UInt32(spawnRect.width * sizeMin),
        max: UInt32(spawnRect.width * sizeMax)
      )
      let width = spawnRect.width / CGFloat(widthCount)
      
      for i in 0..<widthCount {
        
        let block = SKSpriteNode(
          color: blockColor,
          size: CGSize(width: width, height: height)
        )
        let pos = spawnRect.origin
        block.position = CGPoint(
          x: pos.x + CGFloat(i) * width + (width * 0.5),
          y: pos.y + CGFloat(j) * height + (height * 0.5)
        )
        block.alpha = 0
        
        let fade = SKAction.fadeIn(withDuration: 0.25)
        let random = SKAction.run { self.backgroundColor = .random }
        block.run(.sequence([fade, random]), withKey: "NoKill")
        
        addChild(block)
        badBlocks.append(block)
      }
    }
    chooseBlocks()
  }
  
  final func flash() {
    
    guard action(forKey: "NoFlash") == nil else { return }
    
    let red = SKAction.colorize(with: .red, colorBlendFactor: 1, duration: 0)
    let reset = SKAction.colorize(with: backgroundColor, colorBlendFactor: 1, duration: 0.5)
    run(.sequence([red, reset]), withKey: "NoFlash")
  }
  
  func preKilledBlock(_ block: SKSpriteNode) {
    score += 1
  }
  
  func chooseBlocks() {
    chosenBlocks.append(contentsOf: badBlocks)
    badBlocks = []
  }
  
  func restartGame() {
    
    let scale = SKAction.fadeOut(withDuration: 0.25)
    let remove = SKAction.removeFromParent()
    for block in badBlocks {
      block.run(.sequence([scale, remove]), withKey: "NoKill")
    }
    
    generateBlocks()
  }
  
  final private func killBlock(_ block: SKSpriteNode) {
    
    AudioManager.playSnap()
    preKilledBlock(block)
    
    let filter = SKAction.run {
      self.badBlocks.remove(block)
      self.chosenBlocks.remove(block)
      if self.chosenBlocks.isEmpty { self.restartGame() }
    }
    let scale = SKAction.scale(to: 0, duration: 0.25)
    let remove = SKAction.removeFromParent()
    block.run(.sequence([filter, scale, remove]), withKey: "NoKill")
  }
  
  final func killTouchedBlocks(_ touch: UITouch) {
    
    guard interactive else { return }
    
    let node = atPoint(touch.location(in: self))
    if node is SKSpriteNode && node.action(forKey: "NoKill") == nil {
      killBlock(node as! SKSpriteNode)
    }
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    for touch in touches {
      killTouchedBlocks(touch)
    }
  }
  
  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
    for touch in touches {
      killTouchedBlocks(touch)
    }
  }
    
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    for touch in touches {
      killTouchedBlocks(touch)
    }
  }
}
