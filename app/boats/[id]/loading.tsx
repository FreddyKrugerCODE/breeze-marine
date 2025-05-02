import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BoatDetailLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Boats
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-lg" />

            <div className="grid grid-cols-4 gap-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="description" disabled>
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" disabled>
                Specifications
              </TabsTrigger>
              <TabsTrigger value="features" disabled>
                Features
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-10 w-1/2 mb-4" />

              <Separator className="my-4" />

              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-5 w-5 mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
