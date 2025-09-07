"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs?: string[]
  activeTab?: string
  onTabChange?: (tab: string) => void
  className?: string
  children?: React.ReactNode
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

interface TabsTriggerProps {
  className?: string
  value: string
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

interface TabsContentProps {
  className?: string
  value: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className = "", children }) => {
  if (tabs && activeTab && onTabChange) {
    return (
      <div className={`flex border-b border-gray-200 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-medium relative ${
              activeTab === tab ? "text-black" : "text-muted-foreground"
            }`}
            onClick={() => onTabChange(tab)}
          >
            <div className="relative px-4">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-[-12px] left-0 w-full h-[2px] bg-black transition-all"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return <>{children}</>
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return <div className={cn("flex border-b border-gray-200", className)}>{children}</div>
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ className, value, children, active, onClick }) => {
  return (
    <button
      className={cn(
        "flex-1 py-3 text-sm font-medium relative px-4",
        active ? "text-black" : "text-muted-foreground",
        className,
      )}
      onClick={onClick}
    >
      <div className="relative">
        {children}
        {active && <div className="absolute bottom-[-12px] left-0 w-full h-[2px] bg-black transition-all"></div>}
      </div>
    </button>
  )
}

export const TabsContent: React.FC<TabsContentProps> = ({ className, value, children }) => {
  return <div className={cn("mt-4 focus:outline-none", className)}>{children}</div>
}
