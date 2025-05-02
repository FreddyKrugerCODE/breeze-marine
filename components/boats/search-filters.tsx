"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface SearchFiltersProps {
  filterOptions: {
    manufacturers: string[]
    types: string[]
  }
}

export function SearchFilters({ filterOptions }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    manufacturer: searchParams.get("manufacturer") || "",
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 500000,
    minYear: searchParams.get("minYear") ? Number(searchParams.get("minYear")) : 2000,
    maxYear: searchParams.get("maxYear") ? Number(searchParams.get("maxYear")) : new Date().getFullYear(),
    minLength: searchParams.get("minLength") ? Number(searchParams.get("minLength")) : 0,
    maxLength: searchParams.get("maxLength") ? Number(searchParams.get("maxLength")) : 100,
  })

  // Price range slider
  const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice, filters.maxPrice])

  // Year range slider
  const [yearRange, setYearRange] = useState<[number, number]>([filters.minYear, filters.maxYear])

  // Length range slider
  const [lengthRange, setLengthRange] = useState<[number, number]>([filters.minLength, filters.maxLength])

  // Update filters when sliders change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }))
  }, [priceRange])

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minYear: yearRange[0],
      maxYear: yearRange[1],
    }))
  }, [yearRange])

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minLength: lengthRange[0],
      maxLength: lengthRange[1],
    }))
  }, [lengthRange])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.keyword) params.set("keyword", filters.keyword)
    if (filters.manufacturer) params.set("manufacturer", filters.manufacturer)
    if (filters.type) params.set("type", filters.type)

    if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice < 500000) params.set("maxPrice", filters.maxPrice.toString())

    if (filters.minYear > 2000) params.set("minYear", filters.minYear.toString())
    if (filters.maxYear < new Date().getFullYear()) params.set("maxYear", filters.maxYear.toString())

    if (filters.minLength > 0) params.set("minLength", filters.minLength.toString())
    if (filters.maxLength < 100) params.set("maxLength", filters.maxLength.toString())

    // Preserve sort parameter if it exists
    const sort = searchParams.get("sort")
    if (sort) params.set("sort", sort)

    router.push(`/boats?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      keyword: "",
      manufacturer: "",
      type: "",
      minPrice: 0,
      maxPrice: 500000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      minLength: 0,
      maxLength: 100,
    })

    setPriceRange([0, 500000])
    setYearRange([2000, new Date().getFullYear()])
    setLengthRange([0, 100])

    router.push("/boats")
  }

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "minPrice" && value > 0) return true
    if (key === "maxPrice" && value < 500000) return true
    if (key === "minYear" && value > 2000) return true
    if (key === "maxYear" && value < new Date().getFullYear()) return true
    if (key === "minLength" && value > 0) return true
    if (key === "maxLength" && value < 100) return true
    return value !== "" && value !== false
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Search</h3>
        <div className="space-y-2">
          <Input
            placeholder="Search boats..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Manufacturer</h3>
        <div className="space-y-2">
          {filterOptions.manufacturers.map((manufacturer) => (
            <div key={manufacturer} className="flex items-center space-x-2">
              <Checkbox
                id={`manufacturer-${manufacturer}`}
                checked={filters.manufacturer === manufacturer}
                onCheckedChange={() =>
                  setFilters({
                    ...filters,
                    manufacturer: filters.manufacturer === manufacturer ? "" : manufacturer,
                  })
                }
              />
              <Label htmlFor={`manufacturer-${manufacturer}`}>{manufacturer}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Boat Type</h3>
        <div className="space-y-2">
          {filterOptions.types.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.type === type}
                onCheckedChange={() =>
                  setFilters({
                    ...filters,
                    type: filters.type === type ? "" : type,
                  })
                }
              />
              <Label htmlFor={`type-${type}`}>{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Price Range</h3>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider min={0} max={500000} step={5000} value={priceRange} onValueChange={setPriceRange} className="my-6" />
      </div>

      <Separator />

      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Year</h3>
          <span className="text-sm text-muted-foreground">
            {yearRange[0]} - {yearRange[1]}
          </span>
        </div>
        <Slider
          min={2000}
          max={new Date().getFullYear()}
          step={1}
          value={yearRange}
          onValueChange={setYearRange}
          className="my-6"
        />
      </div>

      <Separator />

      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Length (ft)</h3>
          <span className="text-sm text-muted-foreground">
            {lengthRange[0]} - {lengthRange[1]}
          </span>
        </div>
        <Slider min={0} max={100} step={1} value={lengthRange} onValueChange={setLengthRange} className="my-6" />
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters}>
          Apply Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
          <X className="h-4 w-4" /> Reset Filters
        </Button>
      </div>
    </div>
  )
}
