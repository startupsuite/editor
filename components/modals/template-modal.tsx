"use client"

import type React from "react"

import { Modal } from "@/components/ui/modal"
import { useRipple } from "@/hooks/use-ripple"

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose }) => {
  const { createRipple } = useRipple()

  const templates = [
    { id: 1, name: "Blank", color: "#FFFFFF", icon: "crop_square" },
    { id: 2, name: "Business", color: "#E3F2FD", icon: "business" },
    { id: 3, name: "Education", color: "#E8F5E9", icon: "school" },
    { id: 4, name: "Creative", color: "#FFF8E1", icon: "palette" },
    { id: 5, name: "Marketing", color: "#F3E5F5", icon: "campaign" },
    { id: 6, name: "Portfolio", color: "#E0F7FA", icon: "person" },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a Template" width="600px">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col items-center p-4 rounded-md-lg bg-md-surface-container hover:bg-md-surface-container-low transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              createRipple(e)
              // Apply template logic would go here
              onClose()
            }}
          >
            <div
              className="w-full aspect-video rounded-md-md mb-3 flex items-center justify-center"
              style={{ backgroundColor: template.color }}
            >
              <i className="material-icons text-4xl text-md-primary">{template.icon}</i>
            </div>
            <span className="text-md-on-surface font-medium">{template.name}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}
