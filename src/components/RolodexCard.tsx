"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  RotateCw,
  Edit,
  Save,
  X
} from "lucide-react"
import { useRolodex, RolodexContact } from "@/hooks/useRolodex"

interface RolodexCardProps {
  initialData?: RolodexContact
  onUpdate?: (updatedContact: RolodexContact) => void
  className?: string
}

const defaultData: RolodexContact = {
  id: "",
  name: "John Doe",
  company: "Acme Corporation",
  number_1: "555-123-4567",
  number_2: "555-987-6543",
  email: "john.doe@acmecorp.com",
  notes: "Met at the annual tech conference. Interested in our premium plan.",
  area: "San Francisco",
  website: "www.acmecorp.com",
  category: "Client",
  date_added: new Date().toISOString().split("T")[0],
  last_updated: new Date().toISOString().split("T")[0],
}

export default function RolodexCard({
  initialData = defaultData,
  onUpdate,
  className
}: RolodexCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [formData, setFormData] = useState<RolodexContact>({
    ...initialData,
    name: initialData.name || "",
    company: initialData.company || "",
    number_1: initialData.number_1 || "",
    number_2: initialData.number_2 || "",
    email: initialData.email || "",
    notes: initialData.notes || "",
    area: initialData.area || "",
    website: initialData.website || "",
    category: initialData.category || "",
    date_added: initialData.date_added || new Date().toISOString().split("T")[0],
    last_updated: initialData.last_updated || new Date().toISOString().split("T")[0],
  })
  const { updateContact } = useRolodex()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      last_updated: new Date().toISOString().split("T")[0],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.id) {
      const { id, ...updates } = formData
      const updatedContact = await updateContact(id, updates)
      
      if (updatedContact && onUpdate) {
        onUpdate(updatedContact)
      }
    }
    
    setIsEditing(false)
    setShowDetails(false)
  }

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="text-sm">{children}</div>
    </div>
  )

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className={cn(
          "group flex flex-col rounded-lg border cursor-pointer",
          "bg-gradient-to-b from-muted/50 to-muted/10",
          "p-4 sm:p-6",
          "hover:from-muted/60 hover:to-muted/20",
          "transition-colors duration-300",
          "relative w-full",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {formData.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold truncate">{formData.name}</h3>
            </div>
            
            <div className="space-y-4 text-base text-muted-foreground">
              <p className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 shrink-0">
                  <Building2 className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{formData.category}</span>
                </span>
                <span className="truncate">{formData.company}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0" />
                  <span className="truncate">{formData.number_1}</span>
                </p>
                {formData.number_2 && (
                  <p className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate">{formData.number_2}</span>
                  </p>
                )}
              </div>
              
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0" />
                <span className="truncate">{formData.email}</span>
              </p>
              
              {formData.website && (
                <p className="flex items-center gap-3">
                  <Globe className="w-5 h-5 shrink-0" />
                  <span className="truncate">{formData.website}</span>
                </p>
              )}
              
              <p className="flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0" />
                <span className="truncate">{formData.area}</span>
              </p>
            </div>
            
            {formData.notes && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="line-clamp-2">{formData.notes}</p>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 shrink-0">
                <Calendar className="w-3 h-3" />
                Added: {new Date(formData.date_added).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <RotateCw className="w-3 h-3" />
                Updated: {new Date(formData.last_updated).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {isEditing ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit Contact</DialogTitle>
                <DialogDescription>
                  Make changes to the contact information below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="number_1">Primary Phone</Label>
                      <Input
                        id="number_1"
                        name="number_1"
                        value={formData.number_1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="number_2">Secondary Phone</Label>
                      <Input
                        id="number_2"
                        name="number_2"
                        value={formData.number_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="h-20"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl">{formData.name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {formData.category} at {formData.company}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="grid gap-4">
                  <DetailSection title="Contact Information">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-base">
                          <Phone className="w-4 h-4" />
                          {formData.number_1}
                        </p>
                        {formData.number_2 && (
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {formData.number_2}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-base">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${formData.email}`} className="hover:underline">
                            {formData.email}
                          </a>
                        </p>
                        {formData.website && (
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <a href={formData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {formData.website}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </DetailSection>

                  <DetailSection title="Location">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {formData.area}
                    </p>
                  </DetailSection>

                  {formData.notes && (
                    <DetailSection title="Notes">
                      <p className="whitespace-pre-wrap">{formData.notes}</p>
                    </DetailSection>
                  )}

                  <DetailSection title="Record Details">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Added: {new Date(formData.date_added).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <RotateCw className="w-4 h-4" />
                        Updated: {new Date(formData.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </DetailSection>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Contact
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
