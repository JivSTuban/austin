import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, UserPlus, Users, MessageSquare, Home, ListFilter, Settings, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  username: string | null;
  avatar_url: string | null;
}

interface ForumThread {
  id: number;
  title: string;
  author_id: string;
  date: string;
  replies_count: number;
  excerpt: string;
  category: string;
  author_username?: string;
}

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [activeTab, setActiveTab] = useState('users');

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkAdminStatus();
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [user, loading]);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin && !loading) {
      toast.error('Access denied', {
        description: 'You do not have permission to access the admin area'
      });
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate, loading]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      // Get users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Get roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, role');

      if (rolesError) throw rolesError;

      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url');

      if (profilesError) throw profilesError;

      // Ensure profiles is not null and has correct typing
      const safeProfiles = (profiles || []) as Profile[];

      // Combine data
      const rolesMap = new Map(roles?.map(r => [r.id, r.role]) || []);
      const profilesMap = new Map(safeProfiles.map(p => [p.id, { username: p.username, avatar_url: p.avatar_url }]));

      const combinedUsers = authUsers?.users.map(u => ({
        id: u.id,
        email: u.email || '',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        role: rolesMap.get(u.id) || 'user',
        username: profilesMap.get(u.id)?.username || null,
        avatar_url: profilesMap.get(u.id)?.avatar_url || null
      })) || [];

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  // Fetch forum threads
  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          id, 
          title, 
          author_id, 
          date, 
          replies_count, 
          excerpt, 
          category,
          profiles(username)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      type ThreadWithProfile = {
        id: number;
        title: string;
        author_id: string;
        date: string;
        replies_count: number;
        excerpt: string;
        category: string;
        profiles: { username: string | null } | { username: string | null }[];
      };

      const formattedThreads = (data as any)?.map((thread: ThreadWithProfile) => ({
        id: thread.id,
        title: thread.title,
        author_id: thread.author_id,
        date: thread.date,
        replies_count: thread.replies_count,
        excerpt: thread.excerpt,
        category: thread.category,
        author_username: Array.isArray(thread.profiles) 
          ? thread.profiles[0]?.username 
          : thread.profiles?.username
      })) || [];

      setThreads(formattedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast.error('Failed to load forum threads');
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'forum') {
      fetchThreads();
    }
  }, [activeTab, isAdmin]);

  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Delete forum thread
  const deleteThread = async (threadId: number) => {
    try {
      // First delete all replies
      const { error: repliesError } = await supabase
        .from('forum_replies')
        .delete()
        .eq('thread_id', threadId);

      if (repliesError) throw repliesError;

      // Then delete the thread
      const { error: threadError } = await supabase
        .from('forum_threads')
        .delete()
        .eq('id', threadId);

      if (threadError) throw threadError;

      toast.success('Thread deleted');
      fetchThreads();
    } catch (error) {
      console.error('Error deleting thread:', error);
      toast.error('Failed to delete thread');
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading admin panel...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50/40 dark:bg-gray-900/40">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your website content and users</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Home className="h-4 w-4" />
            Back to Site
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div className="text-3xl font-bold">{users.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                <div className="text-3xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Forum Threads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div className="text-3xl font-bold">{threads.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-500" />
                <div className="text-3xl font-bold">
                  {users.length > 0 ? formatDate(users.sort((a, b) => {
                    const dateA = a.last_sign_in_at || a.created_at;
                    const dateB = b.last_sign_in_at || b.created_at;
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                  })[0].last_sign_in_at || users[0].created_at).split(',')[0] : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="forum" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Forum
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input 
                    placeholder="Search..." 
                    className="w-[200px] pl-8" 
                  />
                  <svg
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Button variant="outline" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="users" className="space-y-4">
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage user accounts and permissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>List of all registered users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.username || 'No username'}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.role === 'admin' ? 'default' : 'outline'}
                              className={user.role === 'admin' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                            >
                              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Export Users
                  </Button>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="forum" className="space-y-4">
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Forum Management</CardTitle>
                  <CardDescription>
                    Manage forum threads and replies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>List of all forum threads</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Replies</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {threads.map((thread) => (
                        <TableRow key={thread.id}>
                          <TableCell className="font-medium">
                            {thread.title}
                          </TableCell>
                          <TableCell>{thread.author_username || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{thread.category}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(thread.date)}</TableCell>
                          <TableCell>{thread.replies_count}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => navigate(`/forum/thread/${thread.id}`)}
                              >
                                View
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteThread(thread.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>
                    Configure admin panel settings and permissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Site Name</label>
                        <Input defaultValue="Austin McClain Real Estate" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Admin Email</label>
                        <Input defaultValue="admin@example.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Security Settings</label>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="enable-2fa" className="rounded border-gray-300" />
                        <label htmlFor="enable-2fa">Enable Two-Factor Authentication for Admins</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full sm:w-auto flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
