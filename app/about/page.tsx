import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Anchor, Award, Clock, Shield, Users, Wrench } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Breeze Marine",
  description: "Learn about Breeze Marine's history, mission, and team",
}

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Breeze Marine</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner for boat services, sales, and trailer rentals since 2005
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2005 by a team of passionate boating enthusiasts, Breeze Marine began as a small boat repair shop
            in Long Beach, California. Over the years, we've grown into a full-service marine company offering
            maintenance, repairs, boat sales, and trailer rentals.
          </p>
          <p className="mb-4">
            Our founder, Michael Johnson, started the business with a simple mission: to provide honest, high-quality
            marine services at fair prices. That mission continues to guide everything we do today.
          </p>
          <p>
            With over 5,000 satisfied customers and counting, we've built our reputation on trust, expertise, and
            exceptional customer service. We're proud to be a part of the Long Beach boating community and look forward
            to serving you.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="Breeze Marine shop" fill className="object-cover" />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Certified Technicians</h3>
                <p className="text-muted-foreground">
                  Our team consists of factory-trained, certified marine technicians with years of experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
                <p className="text-muted-foreground">
                  We stand behind our work with a satisfaction guarantee on all services and products.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Timely Service</h3>
                <p className="text-muted-foreground">
                  We respect your time and strive to complete all services on schedule, every time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Michael Johnson",
              title: "Founder & CEO",
              image: "/placeholder.svg?height=300&width=300",
              icon: <Anchor className="h-5 w-5" />,
            },
            {
              name: "Sarah Williams",
              title: "Service Manager",
              image: "/placeholder.svg?height=300&width=300",
              icon: <Wrench className="h-5 w-5" />,
            },
            {
              name: "David Brown",
              title: "Sales Director",
              image: "/placeholder.svg?height=300&width=300",
              icon: <Users className="h-5 w-5" />,
            },
            {
              name: "Jennifer Davis",
              title: "Customer Relations",
              image: "/placeholder.svg?height=300&width=300",
              icon: <Users className="h-5 w-5" />,
            },
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground mb-2">
                    {member.icon}
                    <span>{member.title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Whether you need boat service, are looking to buy a boat, or need to rent a trailer, we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/services/book">Book a Service</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
