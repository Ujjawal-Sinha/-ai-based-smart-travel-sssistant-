"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import TravelChatbot from "@/components/travel-chatbot"

export default function ChatToggleButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] md:w-[400px] z-50 shadow-xl animate-in slide-in-from-bottom-10 duration-300">
          <TravelChatbot />
        </div>
      )}
    </>
  )
}

