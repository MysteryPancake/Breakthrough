//
//  Level1.swift
//  Breakthrough
//
//  Created by MysteryPancake on 28/10/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import SpriteKit
import AVFoundation

class Level1: LevelScene {

  final private var playRiff = true
  final private var section: Int = 0
  final private var interrupt = false
  final var initialCount: Int = 4
  final var bridgeAfter: Int = 4
  final var level: Int = 1
  
  final private func sectionLabel(number: Int, length: TimeInterval) {
    
    interactive = false
    
    let label = SKLabelNode(fontNamed: mainFont)
    label.text = String(number)
    label.fontColor = backgroundColor.contrasted
    label.fontSize *= frame.maxSize / label.frame.maxSize * 0.5
    label.horizontalAlignmentMode = .center
    label.verticalAlignmentMode = .center
    label.alpha = 0
    camera?.addChild(label)
    
    let fade = SKAction.fadeIn(withDuration: length)
    let grow = SKAction.scale(to: 1.5, duration: length)
    let fadeGrow = SKAction.group([fade, grow])
    let remove = SKAction.removeFromParent()
    let interact = SKAction.run { self.interactive = true }
    label.run(.sequence([fadeGrow, remove, interact]))
  }
  
  override func didMove(to view: SKView) {
    
    super.didMove(to: view)
    
    let intro = AudioManager.getMusic("Intro", level: level)
    AudioManager.playMusic(intro!, handler: safeLoop)
    let length = AudioManager.getLength(intro!)
    sectionLabel(number: 1, length: length)
  }
  
  final private func loopChosenBlocks(for time: TimeInterval) {
    
    let count = chosenBlocks.count
    guard count > 0 else { return }
    
    let duration: Double = time / Double(count)
    for (i, block) in chosenBlocks.enumerated() {
      let delay = SKAction.wait(forDuration: Double(i) * duration)
      let white = SKAction.colorize(with: block.color.contrasted, colorBlendFactor: 1, duration: 0)
      let reset = SKAction.colorize(with: block.color, colorBlendFactor: 1, duration: duration)
      block.run(.sequence([delay, white, reset]))
    }
  }
  
  final private func playOutroMusic(_ name: String, handler: AVAudioNodeCompletionHandler? = nil) -> AVAudioPCMBuffer? {
    if let music = AudioManager.getMusic(name, level: level) {
      AudioManager.playMusic(music, handler: handler)
      return music
    } else {
      let outro = AudioManager.getMusic("Outro", level: level)
      AudioManager.playMusic(outro!)
      gameOver = true
      return nil
    }
  }
  
  final private func safeLoop() {
    if interrupt {
      interrupt = false
    } else {
      loopSounds()
    }
  }
  
  final private func loopSounds() {
    let cell = playRiff ? "Riff\(section + 1)" : "Fill\(section + 1)"
    if let music = playOutroMusic(cell, handler: safeLoop), playRiff {
      loopChosenBlocks(for: AudioManager.getLength(music))
    }
    playRiff = !playRiff
  }
  
  final override func restartGame() {
    
    section += 1
    playRiff = true
    super.restartGame()
    
    if section % bridgeAfter == 0 {
      interrupt = true
      if let bridge = playOutroMusic("Bridge\(section / bridgeAfter)", handler: safeLoop) {
        sectionLabel(number: 1 + (section / bridgeAfter), length: AudioManager.getLength(bridge))
      }
    } else {
      interrupt = true
      loopSounds()
    }
  }
  
  func getAppropriateBlock() -> SKSpriteNode? {
    switch section {
    case 0:
      return badBlocks.last
    case 1:
      return badBlocks.first
    default:
      return badBlocks.random
    }
  }
  
  final override func chooseBlocks() {
    for _ in 0..<initialCount + (section * 2) {
      if let block = getAppropriateBlock() {
        chosenBlocks.append(block)
        badBlocks.remove(block)
      }
    }
  }
  
  final override func preKilledBlock(_ block: SKSpriteNode) {
    if chosenBlocks.first === block {
      score += 1
    } else {
      score -= 1
      flash()
    }
  }
}
