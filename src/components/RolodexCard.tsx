"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  Building2,
  Phone,
  Mail,
  Globe,
  FileText,
  MapPin,
  Tag,
  Calendar,
  RotateCw,
  Edit,
  Save,
} from "lucide-react"
import { useRolodex, RolodexContact } from "@/hooks/useRolodex"

interface FlipCardProps {
  initialData?: RolodexContact
  primaryColor?: string
  secondaryColor?: string
  onUpdate?: (updatedContact: RolodexContact) => void
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

export default function FlipCard({
  initialData = defaultData,
  primaryColor = "#1b2232", 
  secondaryColor = "#F08A5D", 
  onUpdate
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [formData, setFormData] = useState<RolodexContact>({
    ...initialData,
    // Ensure no null values for input fields
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
    console.log("Form submitted:", formData)
    
    if (formData.id) {
      // Update existing contact
      const { id, ...updates } = formData
      const updatedContact = await updateContact(id, updates)
      
      if (updatedContact && onUpdate) {
        onUpdate(updatedContact)
      }
    }
    
    setIsFlipped(false)
  }

  return (
    <div className="card">
      <div 
        className={`card-inner ${isFlipped ? "flipped" : ""}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* Front of card - Contact Display */}
        <Card
          className="card-front"
          style={{ borderColor: primaryColor, backgroundColor: primaryColor }}
        >
          <CardContent className="pt-3 flex flex-col h-full w-full text-sm">
            <div className="text-center mb-4">
              <div
                className="w-16 h-16 rounded-full mx-auto bg-white p-1 shadow-lg mb-2"
                style={{ border: `3px solid ${primaryColor}` }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: primaryColor, color: "white" }}
                >
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">{formData.name || ""}</h2>
              <p className="text-white/80 text-xs">{formData.category || ""}</p>
            </div>

            <div className="space-y-3 flex-grow text-white">
              <div className="flex items-center gap-2">
                <Building2 className="text-white/80 shrink-0" size={16} />
                <div>
                  <p className="font-medium">{formData.company || ""}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="text-white/80 shrink-0" size={16} />
                <div>
                  <p>{formData.number_1 || ""}</p>
                  {formData.number_2 && <p className="text-xs text-white/70">{formData.number_2 || ""}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="text-white/80 shrink-0" size={16} />
                <p className="truncate">{formData.email || ""}</p>
              </div>

              {formData.website && (
                <div className="flex items-center gap-2">
                  <Globe className="text-white/80 shrink-0" size={16} />
                  <p className="truncate">{formData.website || ""}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="text-white/80 shrink-0" size={16} />
                <p>{formData.area || ""}</p>
              </div>

              {formData.notes && (
                <div className="flex gap-2 mt-2">
                  <FileText className="text-white/80 shrink-0" size={16} />
                  <p className="text-xs text-white/80 line-clamp-2">{formData.notes || ""}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-white/70 mt-3 pt-2 border-t border-white/30">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Added: {formData.date_added || ""}</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCw size={12} />
                <span>Updated: {formData.last_updated || ""}</span>
              </div>
            </div>

            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }} 
              className="mt-2 py-1 h-8 text-xs bg-white text-black hover:bg-white/90"
            >
              <Edit size={14} className="mr-1" /> Edit Contact
            </Button>
          </CardContent>
        </Card>

        {/* Back of card - Edit Form */}
        <Card
          className="card-back"
          style={{ borderColor: secondaryColor, backgroundColor: secondaryColor }}
        >
          <CardContent className="p-4 overflow-y-auto">
            <form 
              onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(e);
              }} 
              className="space-y-3 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="flex items-center gap-1 text-xs text-white">
                    <User size={14} /> Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                    className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="company" className="flex items-center gap-1 text-xs text-white">
                    <Building2 size={14} /> Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company || ""}
                    onChange={handleChange}
                    required
                    className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="number_1" className="flex items-center gap-1 text-xs text-white">
                      <Phone size={14} /> Primary Number
                    </Label>
                    <Input
                      id="number_1"
                      name="number_1"
                      value={formData.number_1 || ""}
                      onChange={handleChange}
                      required
                      className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="number_2" className="flex items-center gap-1 text-xs text-white">
                      <Phone size={14} /> Secondary
                    </Label>
                    <Input
                      id="number_2"
                      name="number_2"
                      value={formData.number_2 || ""}
                      onChange={handleChange}
                      className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="flex items-center gap-1 text-xs text-white">
                    <Mail size={14} /> Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  
                    className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="website" className="flex items-center gap-1 text-xs text-white">
                    <Globe size={14} /> Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="area" className="flex items-center gap-1 text-xs text-white">
                      <MapPin size={14} /> Area
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      value={formData.area || ""}
                      onChange={handleChange}
                      required
                      className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="category" className="flex items-center gap-1 text-xs text-white">
                      <Tag size={14} /> Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category || ""}
                      onChange={handleChange}
                      required
                      className="border-white/30 h-8 text-sm bg-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes" className="flex items-center gap-1 text-xs text-white">
                    <FileText size={14} /> Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    className="h-16 border-white/30 resize-none text-sm bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/30 mt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }} 
                  className="h-7 text-xs bg-transparent border-white text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-7 text-xs bg-white text-black hover:bg-white/90"
                >
                  <Save size={14} className="mr-1" /> Save Contact
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .card {
          width: 320px;
          height: 520px;
          perspective: 1000px;
        }
        
        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.999s;
          cursor: pointer;
        }
        
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .card-front {
          transform: rotateY(0deg);
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
        `
      }} />
    </div>
  )
}
