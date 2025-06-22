import { useState, useCallback, useEffect } from 'react';
import { Save, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateForumThread } from '@/lib/helpers';
import { useAuth } from '@/lib/AuthContext';

interface EditDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  threadId: number;
  initialData: {
    title: string;
    content: string;
    category: string;
  };
}

const categories = [
  { id: 'first-time-buyers', name: 'First Time Buyers' },
  { id: 'financing', name: 'Mortgage & Financing' },
  { id: 'market-trends', name: 'Market Trends' },
  { id: 'home-improvement', name: 'Home Improvement' },
  { id: 'neighborhood', name: 'Neighborhood Discussion' },
];

export function EditDiscussionModal({ isOpen, onClose, onSuccess, threadId, initialData }: EditDiscussionModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData.title,
    content: initialData.content,
    category: initialData.category
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      setFormData({
        title: initialData.title,
        content: initialData.content,
        category: initialData.category
      });
    }
  }, [isOpen, initialData]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !user) {
      return;
    }
    
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
      
      // Log debug information
      console.log('[EditDiscussionModal] Updating thread with:', {
        threadId,
        userId: user.id,
        formData
      });
      
      await updateForumThread(
        threadId,
        user.id,
        {
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category
        }
      );
      
      toast.success('Discussion updated successfully');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error updating discussion:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update discussion', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, threadId, user, onSuccess, onClose, isSubmitting]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isSubmitting) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh] bg-white">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Edit className="w-5 h-5 text-blue-600" />
            <DialogTitle>Edit Discussion</DialogTitle>
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
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
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
              disabled={isSubmitting}
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-200"
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
              className="min-h-[150px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
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
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
