"use client"

import { AppBar } from "@/components/app-bar"
import { BottomBar } from "@/components/bottom-bar"
import { Canvas } from "@/components/canvas"
import { NavigationRail } from "@/components/navigation-rail"
import { DocumentProvider } from "@/context/document-context"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ZoomProvider } from "@/context/zoom-context"
import { PhotoMenuInitializer } from "@/components/photo-menu-initializer"
import { DebugInitializer } from "@/components/debug-initializer"

export default function Home() {
  return (
    <DocumentProvider>
      <ZoomProvider>
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col h-screen">
            <AppBar />
            <div className="flex flex-1 overflow-hidden">
              <NavigationRail />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Canvas />
                <BottomBar />
              </div>
            </div>
            <PhotoMenuInitializer />
            <DebugInitializer />
          </div>
        </DndProvider>
      </ZoomProvider>
    </DocumentProvider>
  )
}
