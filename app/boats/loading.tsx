import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Ship } from "lucide-react"

export default function BoatsLoading() {
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
          <Skeleton className="h-9 w-[100px] lg:hidden" />
          <Skeleton className="h-9 w-[180px] ml-auto" />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Skeleton className="h-[600px] w-full" />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-[225px]" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-3" />

                    <div className="flex flex-wrap gap-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex gap-2 w-full">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
