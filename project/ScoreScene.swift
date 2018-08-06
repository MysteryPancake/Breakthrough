//
//  ScoreScene.swift
//  Breakthrough
//
//  Created by MysteryPancake on 1/7/17.
//  Copyright © 2017 MysteryPancake. All rights reserved.
//

import SpriteKit

final class ScoreScene: SKScene {
  
  private var button: CAShapeLayer!
  var score: Int = 0
  
  private func nextButton(at pos: CGPoint, size: CGFloat) -> CAShapeLayer {
    
    let oval = UIBezierPath(ovalIn: CGRect(x: pos.x, y: pos.y, width: size, height: size))
    
    let circle = CAShapeLayer()
    circle.path = oval.cgPath
    circle.fillColor = UIColor(white: 0, alpha: 0.5).cgColor
    
    let margin = size * 0.25
    
    let triangle = UIBezierPath()
    triangle.move(to: CGPoint(x: pos.x + margin, y: pos.y + margin))
    triangle.addLine(to: CGPoint(x: pos.x + size - margin, y: pos.y + size * 0.5))
    triangle.addLine(to: CGPoint(x: pos.x + margin, y: pos.y + size - margin))
    
    let arrow = CAShapeLayer()
    arrow.path = triangle.cgPath
    arrow.strokeColor = UIColor.white.cgColor
    arrow.lineWidth = size * 0.05
    arrow.fillColor = UIColor.clear.cgColor
    circle.addSublayer(arrow)
    
    return circle
  }
  
  override func didMove(to view: SKView) {
    
    let label = SKLabelNode(fontNamed: mainFont)
    label.text = "0"
    label.fontColor = backgroundColor.contrasted
    label.fontSize *= frame.maxSize / label.frame.maxSize * 0.25
    label.position = CGPoint(x: view.center.x, y: frame.height * 0.75)
    label.horizontalAlignmentMode = .center
    label.verticalAlignmentMode = .center
    addChild(label)
    
    let size = frame.maxSize * 0.25
    button = nextButton(
      at: CGPoint(
        x: frame.width * 0.5 - size * 0.5,
        y: frame.height * 0.75 - size * 0.5
      ),
      size: size
    )
    view.layer.addSublayer(button)
    
    guard score > 0 else { return }
    
    let time = TimeInterval(1 / Double(score))
    let delay = SKAction.wait(forDuration: time)
    let increase = SKAction.run {
      let number = Int(label.text!)!
      label.text = String(number + 1)
      AudioManager.playSnap(Float(number * 10))
    }
    let delayIncrease = SKAction.repeat(.sequence([delay, increase]), count: score)
    
    let scale = SKAction.scale(to: 1.25, duration: 0)
    let reset = SKAction.scale(to: 1, duration: 1)
    label.run(.sequence([delayIncrease, scale, reset]))
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    
    let pos = touches.first!.location(in: self)
    let convert = convertPoint(fromView: pos)
    
    if button.path?.contains(convert) ?? false {
      
      AudioManager.playSnap()
      button.removeFromSuperlayer()
      
      SceneManager.transition(to: .nextLevel)
    }
  }
}
