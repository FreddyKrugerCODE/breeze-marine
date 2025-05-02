import { createService } from "./services/service-service"
import { createBoat } from "./services/boat-service"
import { createTrailer } from "./services/trailer-service"
import { createUser } from "./services/user-service"

export async function seedDatabase() {
  // Seed services
  const services = [
    {
      name: "Engine Maintenance",
      description: "Complete engine service including oil change, filter replacement, and system checks.",
      category: "Maintenance",
      price: 299.99,
      duration: 120,
      active: true,
    },
    {
      name: "Hull Repairs",
      description: "Professional repair of hull damage, cracks, and gelcoat issues.",
      category: "Repair",
      price: null, // Request quote
      duration: 240,
      active: true,
    },
    {
      name: "Detailing",
      description: "Complete boat detailing including wash, wax, and interior cleaning.",
      category: "Maintenance",
      price: 249.99,
      duration: 180,
      active: true,
    },
    {
      name: "Winterization",
      description: "Prepare your boat for winter storage with our comprehensive winterization service.",
      category: "Seasonal",
      price: 349.99,
      duration: 150,
      active: true,
    },
    {
      name: "Diagnostics",
      description: "Complete diagnostic check of all boat systems to identify issues.",
      category: "Maintenance",
      price: 149.99,
      duration: 90,
      active: true,
    },
  ]

  for (const service of services) {
    await createService(service)
  }

  // Seed boats
  const boats = [
    {
      title: "2018 Sea Ray 270",
      make: "Sea Ray",
      model: "270 Sundancer",
      year: 2018,
      length: "27ft",
      price: 79500,
      engine: "Mercury 350hp",
      hours: 120,
      condition: "Excellent",
      description:
        "Beautiful Sea Ray 270 Sundancer in excellent condition. Single Mercury 350hp engine with only 120 hours. Features include air conditioning, generator, full galley, and sleeping accommodations for 4.",
      features: [
        "Air Conditioning",
        "Generator",
        "GPS Navigation",
        "Stereo System",
        "Refrigerator",
        "Microwave",
        "Full Head with Shower",
        "Swimming Platform",
      ],
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      status: "available",
    },
    {
      title: "2020 Boston Whaler 210",
      make: "Boston Whaler",
      model: "210 Montauk",
      year: 2020,
      length: "21ft",
      price: 65000,
      engine: "Yamaha 200hp",
      hours: 85,
      condition: "Like New",
      description:
        "Nearly new Boston Whaler 210 Montauk with Yamaha 200hp outboard. Only 85 hours of use. Perfect for fishing and day cruising. Includes T-top, fish finder, and trailer.",
      features: [
        "T-Top",
        "Fish Finder",
        "GPS",
        "VHF Radio",
        "Live Well",
        "Rod Holders",
        "Cooler Seat",
        "Trailer Included",
      ],
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      status: "available",
    },
    {
      title: "2016 Bayliner 180",
      make: "Bayliner",
      model: "180 Element",
      year: 2016,
      length: "18ft",
      price: 28900,
      engine: "Mercury 115hp",
      hours: 210,
      condition: "Good",
      description:
        "Well-maintained Bayliner 180 Element with Mercury 115hp outboard. Great starter boat for families. Includes bimini top, stereo, and trailer.",
      features: [
        "Bimini Top",
        "Stereo System",
        "Swim Platform",
        "Seating for 7",
        "Storage Compartments",
        "Trailer Included",
      ],
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      status: "available",
    },
  ]

  for (const boat of boats) {
    await createBoat(boat)
  }

  // Seed trailers
  const trailers = [
    {
      type: "Single Axle",
      capacity: 3000,
      description: "Single axle trailer suitable for boats up to 18ft",
      dailyRate: 75,
      weekendRate: 150,
      weeklyRate: 375,
      active: true,
    },
    {
      type: "Single Axle",
      capacity: 5000,
      description: "Heavy duty single axle trailer suitable for boats up to 21ft",
      dailyRate: 95,
      weekendRate: 190,
      weeklyRate: 475,
      active: true,
    },
    {
      type: "Tandem Axle",
      capacity: 7000,
      description: "Tandem axle trailer suitable for boats up to 26ft",
      dailyRate: 125,
      weekendRate: 250,
      weeklyRate: 625,
      active: true,
    },
    {
      type: "Tandem Axle",
      capacity: 10000,
      description: "Heavy duty tandem axle trailer suitable for boats up to 30ft",
      dailyRate: 150,
      weekendRate: 300,
      weeklyRate: 750,
      active: true,
    },
  ]

  for (const trailer of trailers) {
    await createTrailer(trailer)
  }

  // Seed admin user
  await createUser({
    name: "Admin User",
    email: "admin@breeze-marine.com",
    password: "Admin123!",
    role: "admin",
  })
}
