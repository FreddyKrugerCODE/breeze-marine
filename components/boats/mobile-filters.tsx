"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchFilters } from "@/components/boats/search-filters"
import { Filter } from "lucide-react"

interface MobileFiltersProps {
  filterOptions: {
    manufacturers: string[]
    types: string[]
  }
}

export function MobileFilters({ filterOptions }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down your search with these filters.</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <SearchFilters filterOptions={filterOptions} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
