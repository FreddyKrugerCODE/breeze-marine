import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, Clock, Video } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Breeze Marine",
  description: "Get in touch with Breeze Marine for inquiries and support",
}

export default function ContactPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help with all your boating needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Service Inquiry" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" rows={4} />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">123 Marina Way, Long Beach, CA 90803</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">(562) 555-1234</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@breezemarineservice.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Video Consultation</p>
                  <p className="text-muted-foreground mb-2">Schedule a video call with our experts</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/video-call">Schedule Now</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm">
              For emergency service requests outside of business hours, please call our emergency line at (562)
              555-9876.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Find Us</CardTitle>
            <CardDescription>Visit our location in Long Beach, California</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-[16/9] w-full bg-muted">
              {/* Replace with actual map component or iframe */}
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Map placeholder - Google Maps would be embedded here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="boats">Boat Sales</TabsTrigger>
            <TabsTrigger value="trailers">Trailer Rentals</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {/* FAQ content for services */}
            <Card>
              <CardHeader>
                <CardTitle>How do I schedule a service appointment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  You can schedule a service appointment through our online booking system, by calling our service
                  department, or by visiting our location in person.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What types of boats do you service?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We service all types of recreational boats including powerboats, sailboats, pontoon boats, and
                  personal watercraft.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="boats" className="space-y-4">
            {/* FAQ content for boat sales */}
            <Card>
              <CardHeader>
                <CardTitle>Do you offer financing for boat purchases?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes, we work with several marine financing companies to help you find the best rates and terms for
                  your boat purchase.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I trade in my current boat?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes, we accept trade-ins on most boat purchases. Contact our sales team for a trade-in evaluation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trailers" className="space-y-4">
            {/* FAQ content for trailer rentals */}
            <Card>
              <CardHeader>
                <CardTitle>What do I need to rent a trailer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  You'll need a valid driver's license, proof of insurance, and a vehicle with appropriate towing
                  capacity. A security deposit is also required.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I extend my trailer rental?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes, subject to availability. Please contact us as soon as possible if you need to extend your rental
                  period.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
