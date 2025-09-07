"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useDocument } from "@/context/document-context"

interface IsolatedTextModalProps {
  isOpen: boolean
  onClose: () => void
}

export const IsolatedTextModal: React.FC<IsolatedTextModalProps> = ({ isOpen, onClose }) => {
  const { addElement } = useDocument()
  const [mounted, setMounted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return

    const doc = iframeRef.current.contentDocument

    // Create a completely isolated document
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Reset all styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            body {
              font-size: 16px;
              line-height: 1.5;
              color: #000000;
            }
            
            /* Modal styles */
            .modal {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              background-color: #ffffff;
              border-radius: 6px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            /* Header styles */
            .modal-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 16px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .modal-title {
              font-size: 18px;
              font-weight: 500;
            }
            
            .close-button {
              background: none;
              border: none;
              font-size: 24px;
              line-height: 1;
              cursor: pointer;
              color: #6b7280;
            }
            
            .close-button:hover {
              color: #374151;
            }
            
            /* Content styles */
            .modal-content {
              padding: 16px;
              flex: 1;
              overflow-y: auto;
            }
            
            .instruction-text {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 16px;
            }
            
            /* Add text button */
            .add-text-button {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              width: 100%;
              padding: 12px;
              margin-bottom: 16px;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            
            .add-text-button:hover {
              background-color: #f9fafb;
            }
            
            .text-icon {
              color: #2563eb;
              font-weight: 500;
            }
            
            /* Tabs */
            .tabs-container {
              display: flex;
              width: 100%;
              background-color: #f3f4f6;
              border-radius: 6px;
              margin-bottom: 16px;
            }
            
            .tab {
              flex: 1;
              padding: 8px 16px;
              text-align: center;
              font-size: 14px;
              font-weight: 500;
              color: #6b7280;
              cursor: pointer;
              border: none;
              background: none;
            }
            
            .tab.active {
              background-color: #ffffff;
              color: #000000;
              border-radius: 6px;
            }
            
            /* Section heading */
            .section-heading {
              font-size: 16px;
              font-weight: 500;
              text-align: center;
              margin-bottom: 16px;
            }
            
            /* Text style cards */
            .text-style-card {
              width: 100%;
              padding: 16px;
              margin-bottom: 12px;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            
            .text-style-card:hover {
              background-color: #f9fafb;
            }
            
            .text-style-content {
              text-align: center;
            }
            
            .text-style-label {
              font-size: 12px;
              color: #6b7280;
              text-align: center;
              margin-top: 4px;
            }
            
            /* Heading styles */
            .heading-1 {
              font-size: 36px;
              font-weight: 700;
            }
            
            .heading-2 {
              font-size: 30px;
              font-weight: 700;
            }
            
            .heading-3 {
              font-size: 24px;
              font-weight: 700;
            }
            
            .paragraph {
              font-size: 16px;
              font-weight: 400;
            }
            
            .quote {
              font-size: 18px;
              font-style: italic;
            }
            
            /* Placeholder content */
            .placeholder {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 160px;
              border: 1px dashed #d1d5db;
              border-radius: 6px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title">Text</h2>
              <button class="close-button" id="close-button">×</button>
            </div>
            <div class="modal-content">
              <p class="instruction-text">Click to add or drag text to the canvas</p>
              
              <button class="add-text-button" id="add-text-button">
                <span class="text-icon">T</span>
                <span>Add text box</span>
              </button>
              
              <div class="tabs-container">
                <button class="tab active" data-tab="text">Text</button>
                <button class="tab" data-tab="tables">Tables</button>
                <button class="tab" data-tab="lists">Lists</button>
                <button class="tab" data-tab="callouts">Callouts</button>
              </div>
              
              <div id="text-tab" class="tab-content">
                <h3 class="section-heading">Text Styles</h3>
                
                <div class="text-style-card" data-text-type="heading1">
                  <div class="text-style-content heading-1">Heading 1</div>
                  <div class="text-style-label">Heading 1</div>
                </div>
                
                <div class="text-style-card" data-text-type="heading2">
                  <div class="text-style-content heading-2">Heading 2</div>
                  <div class="text-style-label">Heading 2</div>
                </div>
                
                <div class="text-style-card" data-text-type="heading3">
                  <div class="text-style-content heading-3">Heading 3</div>
                  <div class="text-style-label">Heading 3</div>
                </div>
                
                <div class="text-style-card" data-text-type="body">
                  <div class="text-style-content paragraph">This is paragraph text</div>
                  <div class="text-style-label">Paragraph</div>
                </div>
                
                <div class="text-style-card" data-text-type="quote">
                  <div class="text-style-content quote">"This is a quote"</div>
                  <div class="text-style-label">Quote</div>
                </div>
              </div>
              
              <div id="tables-tab" class="tab-content" style="display: none;">
                <div class="placeholder">Tables feature coming soon</div>
              </div>
              
              <div id="lists-tab" class="tab-content" style="display: none;">
                <div class="placeholder">Lists feature coming soon</div>
              </div>
              
              <div id="callouts-tab" class="tab-content" style="display: none;">
                <div class="placeholder">Callouts feature coming soon</div>
              </div>
            </div>
          </div>
          
          <script>
            // Close button
            document.getElementById('close-button').addEventListener('click', function() {
              window.parent.postMessage({ type: 'CLOSE_TEXT_MODAL' }, '*');
            });
            
            // Add text button
            document.getElementById('add-text-button').addEventListener('click', function() {
              window.parent.postMessage({ type: 'ADD_TEXT', textType: 'body', content: 'Add your text here' }, '*');
            });
            
            // Text style cards
            document.querySelectorAll('.text-style-card').forEach(function(card) {
              card.addEventListener('click', function() {
                const textType = this.getAttribute('data-text-type');
                let content = '';
                
                switch(textType) {
                  case 'heading1':
                    content = 'Heading 1';
                    break;
                  case 'heading2':
                    content = 'Heading 2';
                    break;
                  case 'heading3':
                    content = 'Heading 3';
                    break;
                  case 'body':
                    content = 'This is paragraph text';
                    break;
                  case 'quote':
                    content = '"This is a quote"';
                    break;
                }
                
                window.parent.postMessage({ type: 'ADD_TEXT', textType, content }, '*');
              });
            });
            
            // Tabs
            document.querySelectorAll('.tab').forEach(function(tab) {
              tab.addEventListener('click', function() {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(function(t) {
                  t.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(function(content) {
                  content.style.display = 'none';
                });
                
                // Show selected tab content
                const tabName = this.getAttribute('data-tab');
                document.getElementById(tabName + '-tab').style.display = 'block';
              });
            });
          </script>
        </body>
      </html>
    `)
    doc.close()

    // Handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      const { type, textType, content } = event.data

      if (type === "CLOSE_TEXT_MODAL") {
        onClose()
      } else if (type === "ADD_TEXT") {
        let fontSize = 16
        let bold = false
        let italic = false

        switch (textType) {
          case "heading1":
            fontSize = 32
            bold = true
            break
          case "heading2":
            fontSize = 28
            bold = true
            break
          case "heading3":
            fontSize = 24
            bold = true
            break
          case "body":
            fontSize = 16
            break
          case "quote":
            fontSize = 18
            italic = true
            break
        }

        addElement({
          type: "text",
          textType,
          content,
          position: { x: 300, y: 200 },
          size: { width: 300, height: 50 },
          rotation: 0,
          zIndex: 1,
          fontFamily: "font-roboto",
          fontSize,
          color: "#000000",
          bold,
          italic,
          underline: false,
          strikethrough: false,
          alignment: "left",
          effect: "none",
          effectIntensity: 50,
        })
        onClose()
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [addElement, onClose])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-auto overflow-hidden">
        <iframe ref={iframeRef} className="w-full h-[600px] border-0" title="Text Modal" />
      </div>
    </div>,
    document.body,
  )
}
