import { useState, useCallback } from 'react';
import { Send, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DiscussionData) => Promise<void>;
}

export interface DiscussionData {
  title: string;
  content: string;
  category: string;
}

const categories = [
  { id: 'first-time-buyers', name: 'First Time Buyers' },
  { id: 'financing', name: 'Mortgage & Financing' },
  { id: 'market-trends', name: 'Market Trends' },
  { id: 'home-improvement', name: 'Home Improvement' },
  { id: 'neighborhood', name: 'Neighborhood Discussion' },
];

export function NewDiscussionModal({ isOpen, onClose, onSubmit }: NewDiscussionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'first-time-buyers'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      content: '',
      category: 'first-time-buyers'
    });
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (!formData.title.trim()) {
        toast.error('Please enter a title');
        return;
      }

      if (!formData.content.trim()) {
        toast.error('Please enter content');
        return;
      }

      setIsSubmitting(true);
      await onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting discussion:', error);
      toast.error('Failed to create discussion');
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, handleClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <DialogTitle>Start a New Discussion</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={value => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="What's your discussion about?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Content
            </label>
            <Textarea
              value={formData.content}
              onChange={e => handleChange('content', e.target.value)}
              placeholder="Share your thoughts, questions, or experiences..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            {isSubmitting ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Discussion
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
