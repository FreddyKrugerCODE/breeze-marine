import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}

export default function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Marina in Long Beach with boats"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-4 md:px-8 lg:px-16 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{title}</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
