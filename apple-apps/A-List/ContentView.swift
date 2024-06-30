//
//  ContentView.swift
//  A-List
//
//  Created by Matt Wyskiel on 6/30/24.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        List {
            listItem(item: MixItem(title: "2024-05-26 - Dance Them All Away (The Envious Mix)", durationLabel: "31:26"))
            
            listItem(item: MixItem(title: "2024-05-26 - Dance Them All Away (The Envious Mix)", durationLabel: "31:26", isDownloaded: true))
            
            listItem(item: MixItem(title: "2024-05-26 - Dance Them All Away (The Envious Mix)", durationLabel: "31:26"))
            
            listItem(item: MixItem(title: "2024-05-26 - Dance Them All Away (The Envious Mix)", durationLabel: "31:26", isDownloaded: true))
        }
        .listStyle(.plain)
        .navigationTitle("A-List")
        .toolbar {
            ToolbarItem(id: "settings", placement: .topBarTrailing) {
                Button {
                    
                } label: {
                    Image(systemName: "gearshape")
                }

            }
        }
    }
    
    func listItem(item: MixItem) -> some View {
        ZStack {
            HStack {
                VStack(alignment: .leading) {
                    Text(item.title)
                    Text(item.durationLabel)
                        .font(.subheadline)
                    
                }
                if item.isDownloaded {
                    Image(systemName: "checkmark")
                        .resizable()
                        .foregroundColor(Color(uiColor: .lightGray))
                        .frame(width: 15, height: 15)
                } else {
                    Circle()
                        .fill(.clear)
                        .frame(width: 15, height: 15)
                }
            }
            NavigationLink {
                Text(item.title)
            } label: {
                EmptyView()
            }.isDetailLink(true)
                .opacity(0)
        }
    }
}

#Preview {
    NavigationSplitView {
        ContentView()
    } detail: {
        Text("")
    }
}
