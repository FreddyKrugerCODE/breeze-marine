import type { Metadata } from "next"
import { SearchFilters } from "@/components/boats/search-filters"
import { MobileFilters } from "@/components/boats/mobile-filters"
import { BoatListingCard } from "@/components/boats/boat-listing-card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ship } from "lucide-react"
import { sql } from "@/lib/db"

export const metadata: Metadata = {
  title: "Boats for Sale | Breeze Marine",
  description: "Browse our selection of quality boats for sale",
}

// Simple function to get all boats
async function getAllBoats() {
  try {
    const boats = await sql`SELECT * FROM "Boat" ORDER BY year DESC`
    return Array.isArray(boats) ? boats : []
  } catch (error) {
    console.error("Failed to fetch boats:", error)
    return []
  }
}

// Get unique manufacturers and types for filters
async function getFilterOptions() {
  try {
    const makes = await sql`SELECT DISTINCT make FROM "Boat" ORDER BY make`
    const types = await sql`SELECT DISTINCT type FROM "Boat" ORDER BY type`

    return {
      manufacturers: Array.isArray(makes) ? makes.map((m: any) => m.make).filter(Boolean) : [],
      types: Array.isArray(types) ? types.map((t: any) => t.type).filter(Boolean) : [],
    }
  } catch (error) {
    console.error("Failed to fetch filter options:", error)
    return { manufacturers: [], types: [] }
  }
}

export default async function BoatsPage() {
  const boats = await getAllBoats()
  const filterOptions = await getFilterOptions()

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Ship className="mr-2 h-6 w-6" />
            Boats for Sale
          </h1>
          <p className="text-muted-foreground mt-1">Find your perfect boat from our selection of quality vessels</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <MobileFilters filterOptions={filterOptions} />
          <div className="ml-auto flex items-center">
            <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">Sort by:</span>
            <Select defaultValue="default">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="year-desc">Year: Newest First</SelectItem>
                <SelectItem value="year-asc">Year: Oldest First</SelectItem>
                <SelectItem value="length-desc">Length: Longest First</SelectItem>
                <SelectItem value="length-asc">Length: Shortest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <SearchFilters filterOptions={filterOptions} />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{boats.length}</span> boats
            </p>
          </div>

          {boats.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No boats found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {boats.map((boat: any) => (
                <BoatListingCard key={boat.id} boat={boat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
