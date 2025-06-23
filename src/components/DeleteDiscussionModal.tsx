import { useState, useCallback } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { deleteForumThread } from '@/lib/helpers';
import { useAuth } from '@/lib/AuthContext';

interface DeleteDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: number;
  threadTitle: string;
  onThreadDeleted?: (threadId: number) => void;
}

export function DeleteDiscussionModal({ 
  isOpen, 
  onClose, 
  threadId, 
  threadTitle,
  onThreadDeleted 
}: DeleteDiscussionModalProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = useCallback(() => {
    if (!isDeleting) {
      onClose();
    }
  }, [onClose, isDeleting]);

  const handleDelete = useCallback(async () => {
    if (isDeleting || !user) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteForumThread(threadId, user.id);
      
      toast.success('Thread deleted successfully');
      
      // Call the callback if provided
      if (onThreadDeleted) {
        onThreadDeleted(threadId);
      }
      
      onClose();
    } catch (error: unknown) {
      console.error('Error deleting thread:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete thread', {
        description: errorMessage
      });
    } finally {
      setIsDeleting(false);
    }
  }, [threadId, user, onThreadDeleted, onClose, isDeleting]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle>Delete Discussion</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this discussion? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 border border-red-100 bg-red-50 rounded-md mb-4">
          <h3 className="font-medium text-gray-900 mb-1">
            {threadTitle}
          </h3>
          <p className="text-sm text-gray-500">
            All replies to this discussion will also be deleted.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <Trash2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Discussion
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
