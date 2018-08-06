//
//  AudioManager.swift
//  Breakthrough
//
//  Created by MysteryPancake on 15/10/16.
//  Copyright © 2016 MysteryPancake. All rights reserved.
//

import AVFoundation

struct AudioManager {
  
  static private let engine = AVAudioEngine()
  static let musicNode = AVAudioPlayerNode()
  static let musicLayer = AVAudioPlayerNode()
  static private var musicBuffers: [Int: [String: AVAudioPCMBuffer]] = [:]
  static private let hitNode = AVAudioPlayerNode()
  static private var hitBuffer = AVAudioPCMBuffer()
  static private let pitchUnit = AVAudioUnitTimePitch()
  
  static func setup() {
    
    for url in Bundle.main.urls(forResourcesWithExtension: nil, subdirectory: "Sound")! {
      
      guard url.hasDirectoryPath else { continue }
      
      let directory = url.lastPathComponent
      let level = Int(directory)!
      musicBuffers[level] = [:]
      
      for file in Bundle.main.urls(forResourcesWithExtension: "wav", subdirectory: "Sound/\(directory)")! {
        let fileName = file.deletingPathExtension().lastPathComponent
        musicBuffers[level]?[fileName] = loadBuffer(file)
      }
    }
    
    if let hitSound = Bundle.main.url(forResource: "Snap", withExtension: "wav", subdirectory: "Sound") {
      hitBuffer = loadBuffer(hitSound)!
    }
  
    engine.attach(musicNode)
    engine.connect(musicNode, to: engine.mainMixerNode, format: nil)

    musicLayer.volume = 0
    engine.attach(musicLayer)
    engine.connect(musicLayer, to: engine.mainMixerNode, format: nil)
    
    engine.attach(hitNode)
    engine.attach(pitchUnit)
    engine.connect(hitNode, to: pitchUnit, format: hitBuffer.format)
    engine.connect(pitchUnit, to: engine.mainMixerNode, format: hitBuffer.format)
  
    try! engine.start()
  
    musicNode.play()
    musicLayer.play()
    hitNode.play()
  }

  static func getMarkers(_ url: CFURL) -> [AudioFileMarker]? {
    
    var file: AudioFileID?
    var size: UInt32 = 0
    var markerList: [AudioFileMarker] = []
    
    AudioFileOpenURL(url, .readPermission, kAudioFileWAVEType, &file)
    
    AudioFileGetPropertyInfo(file!, kAudioFilePropertyMarkerList, &size, nil)
    
    let length = NumBytesToNumAudioFileMarkers(Int(size))
    
    let data = UnsafeMutablePointer<AudioFileMarkerList>.allocate(capacity: length)
    
    AudioFileGetProperty(file!, kAudioFilePropertyMarkerList, &size, data)
    
    let markers = UnsafeBufferPointer<AudioFileMarker>(start: &data.pointee.mMarkers, count: length)
    for marker in markers {
      markerList.append(marker)
    }
    
    data.deallocate(capacity: length)
    
    return markerList
  }
  
  static private func loadBuffer(_ url: URL) -> AVAudioPCMBuffer? {
    guard let file = try? AVAudioFile(forReading: url) else { return nil }
    let buffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: UInt32(file.length))
    try? file.read(into: buffer!)
    return buffer
  }

  static func getLength(_ buffer: AVAudioPCMBuffer) -> TimeInterval {
    let framecount = Double(buffer.frameLength)
    let samplerate = buffer.format.sampleRate
    return TimeInterval(framecount / samplerate)
  }
  
  static func getMusic(_ name: String, level: Int) -> AVAudioPCMBuffer? {
    return musicBuffers[level]?[name]
  }
  
  static func playMusic(_ buffer: AVAudioPCMBuffer, handler: AVAudioNodeCompletionHandler? = nil) {
    musicNode.scheduleBuffer(buffer, at: nil, options: .interrupts, completionHandler: handler)
  }
  
  static func playLoop(_ buffer: AVAudioPCMBuffer) {
    musicNode.scheduleBuffer(buffer, at: nil, options: .loops)
  }
  
  static func stopLoop() {
    musicNode.stop()
    musicNode.play()
  }
  
  static func stopLayer() {
    musicLayer.stop()
    musicLayer.volume = 0
    musicLayer.play()
  }
  
  static func playSnap(_ pitch: Float? = nil) {
    pitchUnit.pitch = pitch ?? Float(arc4random_uniform(200)) - 100
    hitNode.scheduleBuffer(hitBuffer, at: nil, options: .interrupts)
  }
}
