//
//  GameViewController.swift
//  Breakthrough
//
//  Created by MysteryPancake on 26/9/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import UIKit
import SpriteKit

final class GameViewController: UIViewController {
  
  override func viewDidLoad() {
    
    super.viewDidLoad()
    
    UserDefaults.standard.register(defaults: ["Level": 1])
    
    AudioManager.setup()
    
    let view = self.view as! SKView
    view.ignoresSiblingOrder = true
    
    SceneManager.setView(view)
  }
    
  override var shouldAutorotate: Bool {
    return false
  }

  override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    return .all
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Release any cached data, images, etc that aren't in use.
  }

  override var prefersStatusBarHidden: Bool {
    return true
  }
}
