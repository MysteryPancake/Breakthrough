//
//  Shared.swift
//  Breakthrough
//
//  Created by MysteryPancake on 26/9/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import SpriteKit

var blockColor: UIColor = .random
let mainFont = "GillSans-Light"

extension UIColor {
  
  var contrasted: UIColor {
    var white: CGFloat = 0
    self.getWhite(&white, alpha: nil)
    return white > 0.9 ? .black : .white
  }
  
  static var random: UIColor {
    let r: CGFloat = CGFloat(arc4random()) / CGFloat(UInt32.max)
    let g: CGFloat = CGFloat(arc4random()) / CGFloat(UInt32.max)
    let b: CGFloat = CGFloat(arc4random()) / CGFloat(UInt32.max)
    return UIColor(red: r, green: g, blue: b, alpha: 1)
  }
  
  static var randomHue: UIColor {
    let h: CGFloat = CGFloat(arc4random()) / CGFloat(UInt32.max)
    return UIColor(hue: h, saturation: 1, brightness: 1, alpha: 1)
  }
}

extension UInt32 {
  static func random(min: UInt32, max: UInt32) -> UInt32 {
    return arc4random_uniform(max - min) + min
  }
}

extension Array {
  var random: Element? {
    return isEmpty ? nil : self[Int(arc4random_uniform(UInt32(count)))]
  }
}

extension Array where Element: Equatable {
  mutating func remove(_ object: Element) {
    if let index = index(of: object) {
      remove(at: index)
    }
  }
}

extension CGRect {
  var maxSize: CGFloat {
    return max(self.width, self.height)
  }
}
