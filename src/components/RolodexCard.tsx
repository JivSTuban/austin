"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  X,
  User,
} from "lucide-react";
import { useRolodex, RolodexContact } from "@/hooks/useRolodex";

interface RolodexCardProps {
  initialData?: RolodexContact;
  onUpdate?: (updatedContact: RolodexContact) => void;
  className?: string;
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
};

export default function RolodexCard({
  initialData = defaultData,
  onUpdate,
  className,
}: RolodexCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
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
    date_added:
      initialData.date_added || new Date().toISOString().split("T")[0],
    last_updated:
      initialData.last_updated || new Date().toISOString().split("T")[0],
  });
  const { updateContact } = useRolodex();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      last_updated: new Date().toISOString().split("T")[0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id) {
      const { id, ...updates } = formData;
      const updatedContact = await updateContact(id, updates);

      if (updatedContact && onUpdate) {
        onUpdate(updatedContact);
      }
    }

    setIsEditing(false);
    setShowDetails(false);
  };

  const DetailSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="text-sm">{children}</div>
    </div>
  );

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format website URL to ensure it has a protocol
  const formatWebsiteUrl = (url: string) => {
    if (!url) return "";
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  // Truncate URL for display while preserving the full URL for linking
  const truncateUrl = (url: string, maxLength: number = 30) => {
    if (!url) return "";
    
    // Remove protocol for display
    let displayUrl = url.replace(/^https?:\/\//, "");
    
    // Remove trailing slash
    displayUrl = displayUrl.replace(/\/$/, "");
    
    // If still too long, truncate and add ellipsis
    if (displayUrl.length > maxLength) {
      return displayUrl.substring(0, maxLength - 3) + "...";
    }
    
    return displayUrl;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-[14rem] h-[280px] w-full list-none"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setShowDetails(true)}
      >
        <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3 cursor-pointer">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={3}
          />
          <div
            className={cn(
              "relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-white p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6",
              "transition-all duration-500 transform-gpu",
              isFlipped ? "rotate-y-180" : "",
              className
            )}
          >
            {!isFlipped ? (
              // Front of card
              <div className="relative flex flex-1 flex-col justify-between gap-3">
                <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground truncate max-w-[300px]">
                      {formData.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wider">
                          Company
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                        {formData.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs uppercase tracking-wider">
                          Category
                        </span>
                      </div>
                      <Badge className="bg-[#1b2232]/10 hover:bg-[#1b2232]/20 text-[#1b2232] border-[#1b2232]/20">
                        {formData.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Back of card (flipped)
              <div className="relative flex flex-1 flex-col justify-between gap-3 rotate-y-180">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="pt-0.5 text-lg font-semibold font-sans tracking-[-0.04em] text-balance text-foreground truncate max-w-[300px]">
                      Contact Info
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span className="text-foreground truncate max-w-[250px]">
                        {formData.number_1}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-foreground truncate max-w-[250px]">
                        {formData.email}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-foreground truncate max-w-[250px]">
                        {formData.area}
                      </span>
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {formData.notes || "No notes available"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Badge className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/20">
                    Added: {formatDate(formData.date_added)}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

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
                      className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
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
                      className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
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
                        className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="number_2">Secondary Phone</Label>
                      <Input
                        id="number_2"
                        name="number_2"
                        value={formData.number_2}
                        onChange={handleChange}
                        className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
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
                      className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
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
                        className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
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
                        className="border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
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
                      className="h-20 border-[#1b2232]/20 focus:border-[#1b2232] focus:ring-[#1b2232]/20"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1b2232] hover:bg-[#1b2232]/90"
                  >
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
                    <AvatarFallback className="text-lg bg-[#1b2232] text-primary-foreground">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl">
                      {formData.name}
                    </DialogTitle>
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
                          <Phone className="w-4 h-4 text-blue-500" />
                          {formData.number_1}
                        </p>
                        {formData.number_2 && (
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-blue-500/70" />
                            {formData.number_2}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-base">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <a
                            href={`mailto:${formData.email}`}
                            className="hover:underline"
                          >
                            {formData.email}
                          </a>
                        </p>
                        {formData.website && (
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <a
                              href={formatWebsiteUrl(formData.website)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                              title={formData.website}
                            >
                              {truncateUrl(formData.website)}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </DetailSection>

                  <DetailSection title="Location">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
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
                        <Calendar className="w-4 h-4 text-blue-500" />
                        Added: {formatDate(formData.date_added)}
                      </p>
                      <p className="flex items-center gap-2">
                        <RotateCw className="w-4 h-4 text-blue-500" />
                        Updated: {formatDate(formData.last_updated)}
                      </p>
                    </div>
                  </DetailSection>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
