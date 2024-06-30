//
//  MixItem.swift
//  A-List
//
//  Created by Matt Wyskiel on 6/30/24.
//

import Foundation
import AVFoundation

struct MixItem: Codable {
    let id: Int
    let title: String
    let description: String
    let audioURL: URL
    let publishDate: Date
}

extension MixItem {
    var isDownloaded: Bool {
        // TODO: Implement this based on whether the file is downloaded to the device
        false
    }
}

extension MixItem {
    func loadDurationLabel() async throws -> String {
        let asset = AVURLAsset(url: audioURL)
        let duration = try await asset.load(.duration)
        let durationSeconds = duration.seconds
        let formatter = DateIntervalFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .medium
        return formatter.string(from: DateInterval(start: .now, duration: durationSeconds)) ?? ""
    }
}
