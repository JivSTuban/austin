import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UsernamePage = () => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setIsSubmitting(true);
    try {

      const { data, error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast.success(`Username updated to ${username}!`);
     
      navigate('/', { replace: true });
     
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username', {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">What should we call you?</CardTitle>
          <CardDescription className="text-gray-600">Choose a username to display on your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Set Username'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernamePage;
