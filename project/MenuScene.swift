//
//  MenuScene.swift
//  Breakthrough
//
//  Created by MysteryPancake on 22/10/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import SpriteKit

final class MenuScene: SKScene {
  
  private var rows: Int = 2
  private var columns: Int = 3
  
  private func menuButton(text: String, size: CGSize) -> SKSpriteNode {
    
    let button = SKSpriteNode(color: UIColor(white: 0, alpha: 0.5), size: size)
    button.name = text
    
    let label = SKLabelNode(fontNamed: mainFont)
    label.name = text
    label.text = text
    label.fontColor = .white
    label.fontSize *= button.frame.maxSize / label.frame.maxSize * 0.5
    label.horizontalAlignmentMode = .center
    label.verticalAlignmentMode = .center
    button.addChild(label)
    
    return button
  }
  
  override func didMove(to view: SKView) {
    
    if frame.width > frame.height { swap(&rows, &columns) }
    
    let margin = frame.maxSize * 0.01
    let divideX = (frame.width - margin) / CGFloat(rows)
    let divideY = (frame.height - margin) / CGFloat(columns)
    
    for i in 0..<rows {
      for j in 0..<columns {
        let button = menuButton(
          text: String((i + 1) + rows * (columns - (j + 1))),
          size: CGSize(width: divideX - margin, height: divideY - margin)
        )
        button.position = CGPoint(
          x: CGFloat(i + 1) * divideX + (margin - divideX) * 0.5,
          y: CGFloat(j + 1) * divideY + (margin - divideY) * 0.5
        )
        addChild(button)
      }
    }
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    
    let pos = touches.first!.location(in: self)
    let node = atPoint(pos)
    
    if let number = Int(node.name!) {
      
      AudioManager.playSnap()
      
      let grow = SKAction.scale(to: 1.5, duration: 0.05)
      let shrink = SKAction.scale(to: 1, duration: 0.45)
      node.run(.sequence([grow, shrink]))
      
      SceneManager.transition(to: .level(number))
    }
  }
}
