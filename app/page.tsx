import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Anchor, Ship, Truck } from "lucide-react"
import TestimonialCard from "@/components/testimonial-card"
import ServiceCard from "@/components/service-card"
import BoatCard from "@/components/boat-card"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Professional Boat Services in Long Beach"
        subtitle="Expert maintenance, repairs, sales, and trailer rentals for the Southern California boating community"
        ctaText="Book a Service"
        ctaLink="/services/book"
      />

      {/* Services Overview */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Engine Maintenance"
              description="Keep your boat running smoothly with our comprehensive engine maintenance services."
              icon={<Calendar className="h-10 w-10 text-cyan-600" />}
              link="/services/engine-maintenance"
            />
            <ServiceCard
              title="Hull Repairs"
              description="Professional hull repair services to keep your boat in top condition and looking great."
              icon={<Ship className="h-10 w-10 text-cyan-600" />}
              link="/services/hull-repairs"
            />
            <ServiceCard
              title="Detailing"
              description="Complete boat detailing services to maintain your vessel's appearance and value."
              icon={<Anchor className="h-10 w-10 text-cyan-600" />}
              link="/services/detailing"
            />
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Boats */}
      <section className="py-16 px-4 md:px-8 bg-sky-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Boats For Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BoatCard
              title="2018 Sea Ray 270"
              price={79500}
              imageUrl="/placeholder.svg?height=300&width=400"
              specs={{
                length: "27ft",
                year: 2018,
                engine: "Mercury 350hp",
                hours: 120,
              }}
              link="/boats/sea-ray-270"
            />
            <BoatCard
              title="2020 Boston Whaler 210"
              price={65000}
              imageUrl="/placeholder.svg?height=300&width=400"
              specs={{
                length: "21ft",
                year: 2020,
                engine: "Yamaha 200hp",
                hours: 85,
              }}
              link="/boats/boston-whaler-210"
            />
            <BoatCard
              title="2016 Bayliner 180"
              price={28900}
              imageUrl="/placeholder.svg?height=300&width=400"
              specs={{
                length: "18ft",
                year: 2016,
                engine: "Mercury 115hp",
                hours: 210,
              }}
              link="/boats/bayliner-180"
            />
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/boats">View All Boats</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trailer Rentals */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trailer Rentals</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Boat trailer rental"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h3 className="text-2xl font-bold">Quality Trailers for Any Boat</h3>
              <p className="text-lg text-gray-700">
                We offer a variety of boat trailers for rent to meet your transportation needs. From single-axle to
                tandem-axle trailers, we have options for boats of all sizes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cyan-600" />
                  <span>Single and tandem-axle options</span>
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cyan-600" />
                  <span>Weight capacities from 3,000 to 10,000 lbs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cyan-600" />
                  <span>Daily, weekend, and weekly rental options</span>
                </li>
              </ul>
              <Button asChild size="lg">
                <Link href="/trailers">Book a Trailer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8 bg-sky-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Breeze Marine has been servicing my boat for years. Their attention to detail and expertise is unmatched in Long Beach."
              author="Michael S."
              location="Long Beach, CA"
              rating={5}
            />
            <TestimonialCard
              quote="I purchased my Boston Whaler through Breeze Marine and couldn't be happier with the experience. Fair price and excellent service."
              author="Jennifer T."
              location="Huntington Beach, CA"
              rating={5}
            />
            <TestimonialCard
              quote="Their trailer rental service saved my weekend plans when my trailer broke down. Easy booking and reasonable rates."
              author="David L."
              location="San Pedro, CA"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-cyan-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you need boat maintenance, are looking to buy a boat, or need to rent a trailer, we're here to help
            you enjoy your time on the water.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/services/book">Book a Service</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-cyan-600">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
