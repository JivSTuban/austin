"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionWithCategoriesProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
    category?: string;
  }[];
  contactInfo?: {
    title: string;
    description?: string;
    buttonText: string;
    onContact?: () => void;
  };
}

const FaqSectionWithCategories = React.forwardRef<HTMLElement, FaqSectionWithCategoriesProps>(
  ({ className, title, description, items, contactInfo, ...props }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    // Extract unique categories from items
    const categories = useMemo(() => {
      const allCategories = items
        .map(item => item.category)
        .filter((category): category is string => !!category);
      return [...new Set(allCategories)];
    }, [items]);
    
    // Filter items based on search query and selected category
    const filteredItems = useMemo(() => {
      return items.filter(item => {
        const matchesSearch = searchQuery === "" || 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === null || 
          item.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    }, [items, searchQuery, selectedCategory]);

    // Format answer text with markdown-like syntax
    const formatAnswer = (answer: string) => {
      // Replace **text** with bold text
      let formattedAnswer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle bullet points
      formattedAnswer = formattedAnswer.replace(/- (.*?)\n/g, '<li>$1</li>');
      formattedAnswer = formattedAnswer.replace(/<li>(.*?)<\/li>/g, '<ul class="list-disc pl-5 my-2"><li>$1</li></ul>');
      
      // Handle paragraphs
      formattedAnswer = formattedAnswer.split('\n\n').map(para => `<p class="mb-3">${para}</p>`).join('');
      
      return formattedAnswer;
    };

    return (
      <section
        ref={ref}
        className={cn("py-8 w-full", className)}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[58rem] mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-4xl font-bold text-foreground">
                {title}
              </h2>
              {description && (
                <p className="text-muted-foreground text-lg">
                  {description}
                </p>
              )}
            </div>

            {/* FAQ Items */}
            {filteredItems.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className={cn(
                      "mb-4 rounded-xl",
                      "bg-card text-card-foreground",
                      "border border-border/60",
                      "shadow-sm hover:shadow-md transition-shadow duration-200",
                      "dark:shadow-black/10"
                    )}
                  >
                    <AccordionTrigger 
                      className={cn(
                        "px-6 py-4 text-left hover:no-underline",
                        "data-[state=open]:border-b data-[state=open]:border-border/60"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        {item.category && (
                          <Badge
                            variant="secondary"
                            className="w-fit text-xs font-normal"
                          >
                            {item.category}
                          </Badge>
                        )}
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary">
                          {item.question}
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4 pb-6">
                      <div 
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatAnswer(item.answer) }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10 border rounded-xl">
                <p className="text-muted-foreground">No questions found matching your search.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}

            {/* Contact Section */}
            {contactInfo && (
              <div className="mt-12 p-6 text-center bg-muted/30 rounded-xl border border-border/60">
                <h3 className="text-xl font-medium mb-2">{contactInfo.title}</h3>
                {contactInfo.description && (
                  <p className="text-muted-foreground mb-4">
                    {contactInfo.description}
                  </p>
                )}
                <Button onClick={contactInfo.onContact}>
                  {contactInfo.buttonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);
FaqSectionWithCategories.displayName = "FaqSectionWithCategories";

export { FaqSectionWithCategories };
export type { FaqSectionWithCategoriesProps };
