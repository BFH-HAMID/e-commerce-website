'use client'

import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/types'

interface WhatsAppButtonProps {
  message?: string
  productName?: string
}

export function WhatsAppButton({ message, productName }: WhatsAppButtonProps) {
  const defaultMessage = productName
    ? `Hi! I'm interested in "${productName}". Can you provide more details?`
    : "Hi! I have a question about your products."

  const finalMessage = message || defaultMessage
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(finalMessage)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20bd5a] transition-all hover:scale-105 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline font-medium">Chat with us</span>
    </a>
  )
}
