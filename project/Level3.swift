//
//  Level3.swift
//  Breakthrough
//
//  Created by MysteryPancake on 31/10/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import SpriteKit

final class Level3: LevelScene {
  
  private var difficulty: Int = 0
  private var hearts: [CAShapeLayer] = []
  private var lives: Int = 3 {
    didSet {
      if lives <= 0 {
        AudioManager.stopLoop()
        gameOver = true
      }
    }
  }
  
  private func heartShape(at pos: CGPoint, size: CGFloat) -> CAShapeLayer {
    
    let path = UIBezierPath()
    path.addArc(
      withCenter: CGPoint(x: pos.x + size * 0.25, y: pos.y),
      radius: size * 0.25,
      startAngle: CGFloat.pi,
      endAngle: 0,
      clockwise: true
    )
    path.addArc(
      withCenter: CGPoint(x: pos.x + size * 0.75, y: pos.y),
      radius: size * 0.25,
      startAngle: CGFloat.pi,
      endAngle: 0,
      clockwise: true
    )
    path.addLine(
      to: CGPoint(x: pos.x + size * 0.5, y: pos.y + size * 0.75)
    )
    path.close()
    
    let heart = CAShapeLayer()
    heart.path = path.cgPath
    heart.fillColor = UIColor.white.cgColor
    return heart
  }
  
  override func didMove(to view: SKView) {
    
    super.didMove(to: view)
    
    let heartSize = frame.maxSize * 0.05
    for i in 0..<lives {
      let heart = heartShape(
        at: CGPoint(
          x: heartSize + (CGFloat(i) * heartSize * 1.5),
          y: heartSize
        ),
        size: heartSize
      )
      view.layer.addSublayer(heart)
      hearts.append(heart)
    }
    
    let classic = AudioManager.getMusic("Classic", level: 3)
    AudioManager.playLoop(classic!)
  }
  
  override func chooseBlocks() {
    
    difficulty += 1
    
    let count = badBlocks.count - difficulty
    guard count >= 0 else { return }
    
    for _ in 0..<count {
      if let block = badBlocks.random {
        chosenBlocks.append(block)
        badBlocks.remove(block)
      }
    }
    
    let black = SKAction.colorize(with: .black, colorBlendFactor: 1, duration: 0.5)
    for block in badBlocks {
      let reset = SKAction.colorize(with: block.color, colorBlendFactor: 1, duration: 1.5)
      block.run(.repeatForever(.sequence([black, reset])))
    }
  }
  
  override func preKilledBlock(_ block: SKSpriteNode) {
    if badBlocks.contains(block) {
      hearts.removeLast().removeFromSuperlayer()
      block.color = .black
      score -= 1
      lives -= 1
      flash()
    } else if chosenBlocks.contains(block) {
      score += 1
    }
  }
}
