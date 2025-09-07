"use client"

import type React from "react"
import { useState } from "react"
import { useRipple } from "@/hooks/use-ripple"
import { ElementsPanel } from "@/components/panels/elements-panel"
import { TextPanel } from "@/components/panels/text-panel"
import { useMobile } from "@/hooks/use-mobile"
import { LayoutGrid, Layout, FileText, Upload, Type, ImageIcon, BarChart, Shapes } from "lucide-react"

// Import the custom event dispatcher
import { dispatchCustomEvent } from "@/utils/event-utils"

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
}

interface NavigationRailProps {
  onTogglePanel?: (panelId: string) => void
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ onTogglePanel }) => {
  const { createRipple } = useRipple()
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const isMobile = useMobile()

  const navItems: NavItem[] = [
    { id: "templates", icon: <LayoutGrid size={22} />, label: "Templates" },
    { id: "layouts", icon: <Layout size={22} />, label: "Layouts" },
    { id: "pages", icon: <FileText size={22} />, label: "Pages" },
    { id: "elements", icon: <Shapes size={22} />, label: "Elements" },
    { id: "uploads", icon: <Upload size={22} />, label: "Uploads" },
    { id: "text", icon: <Type size={22} />, label: "Text" },
    { id: "photos", icon: <ImageIcon size={22} />, label: "Photos" },
    { id: "charts", icon: <BarChart size={22} />, label: "Charts" },
  ]

  const handleNavItemClick = (item: NavItem, e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)

    // Special handling for photos
    if (item.id === "photos") {
      // Dispatch a custom event to open the photo menu
      dispatchCustomEvent("open-photo-menu", {})

      // If the photos panel is already active, close it
      if (activePanel === "photos") {
        setActivePanel(null)
      } else {
        // Otherwise, set it as active
        setActivePanel("photos")
      }
    } else {
      // Normal handling for other panels
      setActivePanel(activePanel === item.id ? null : item.id)
    }

    if (onTogglePanel) {
      onTogglePanel(item.id)
    }
  }

  return (
    <div className="flex h-full">
      {/* Navigation rail - updated styling with grey background */}
      <div className="w-[90px] bg-gray-100 flex flex-col items-center py-4 z-[5]">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`w-full flex flex-col items-center justify-center py-3 cursor-pointer ${
              activePanel === item.id ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={(e) => handleNavItemClick(item, e)}
            role="button"
            tabIndex={0}
            aria-label={item.label}
            aria-pressed={activePanel === item.id}
            data-nav-item={item.id}
          >
            <div className={`relative flex items-center justify-center w-10 h-10 mb-1`}>
              {activePanel === item.id && (
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-[1.2] z-0"></div>
              )}
              <div className="relative z-[1]">{item.icon}</div>
            </div>
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Side panels - keep functionality intact */}
      <ElementsPanel isOpen={activePanel === "elements"} onClose={() => setActivePanel(null)} />
      <TextPanel isOpen={activePanel === "text"} onClose={() => setActivePanel(null)} />
    </div>
  )
}
