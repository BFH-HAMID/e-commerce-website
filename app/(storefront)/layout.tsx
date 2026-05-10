import { Header } from '@/components/storefront/header'
import { Footer } from '@/components/storefront/footer'
import { WhatsAppButton } from '@/components/storefront/whatsapp-button'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
