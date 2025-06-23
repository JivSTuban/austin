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
import { Loader2, UserPlus, Users, MessageSquare, Home, ListFilter, Settings, Shield, Building, Plus, Eye, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/Pagination";
import { ensureRolodexTable } from '@/lib/helpers/ensureRolodexTable';
import { Textarea } from "@/components/ui/textarea";
import { ensureSoldPropertiesTable } from "@/lib/helpers/ensureSoldPropertiesTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListings, type Listing } from '../hooks/useListings';
import { ensureListingsTable } from '../lib/helpers/ensureListingsTable';
import { Loading } from '../components/LoadingStates';
import { useReviews, type Review } from '../hooks/useReviews';
import { ensureReviewsTable } from '../lib/helpers/ensureReviewsTable';
import { useVisitorStats } from '../hooks/useVisitors';

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

interface SoldProperty {
  uuid: string;
  address: string;
  year: number;
  city: string;
  date_added: string;
  latest_updated: string;
}

interface EditPropertyState {
  uuid: string;
  address: string;
  year: number;
  city: string;
}

interface RolodexEntry {
  id: string;
  name: string | null;
  company: string | null;
  number_1: string | null;
  number_2: string | null;
  email: string | null;
  notes: string | null;
  area: string | null;
  website: string | null;
  category: string | null;
  date_added: string;
  last_updated: string;
}

interface NewRolodexEntry {
  name: string;
  company: string;
  number_1: string;
  number_2: string;
  email: string;
  notes: string;
  area: string;
  website: string;
  category: string;
}

interface EditRolodexState extends NewRolodexEntry {
  id: string;
}

// Predefined categories for rolodex entries
const ROLODEX_CATEGORIES = [
  "Vendor",
  "Contractor",
  "Property Manager",
  "Real Estate Agent",
  "Lender",
  "Insurance Agent",
  "Title Company",
  "Home Inspector",
  "Appraiser",
  "Attorney",
  "Accountant",
  "Other"
];

// Log the categories
console.log("ROLODEX_CATEGORIES:", ROLODEX_CATEGORIES);

const Admin = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [properties, setProperties] = useState<SoldProperty[]>([]);
  const [totalSoldProperties, setTotalSoldProperties] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('users');
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    address: '',
    year: new Date().getFullYear(),
    city: ''
  });
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<EditPropertyState | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalProperties, setTotalProperties] = useState(0);
  const [rolodexEntries, setRolodexEntries] = useState<RolodexEntry[]>([]);
  const [isAddRolodexOpen, setIsAddRolodexOpen] = useState(false);
  const [isEditRolodexOpen, setIsEditRolodexOpen] = useState(false);
  const [rolodexToDelete, setRolodexToDelete] = useState<string | null>(null);
  const [rolodexCurrentPage, setRolodexCurrentPage] = useState(1);
  const [totalRolodexEntries, setTotalRolodexEntries] = useState(0);
  const [newRolodexEntry, setNewRolodexEntry] = useState<NewRolodexEntry>({
    name: '',
    company: '',
    number_1: '',
    number_2: '',
    email: '',
    notes: '',
    area: '',
    website: '',
    category: ''
  });
  const [editingRolodex, setEditingRolodex] = useState<EditRolodexState | null>(null);
  const [newListing, setNewListing] = useState<Omit<Listing, 'id'>>({
    title: '',
    address: '',
    price: null,
    beds: null,
    baths: null,
    last_updated_from_zillow: null,
    sqft: null,
    zillow_link: '',
    imagelink: ''
  });
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isEditListingOpen, setIsEditListingOpen] = useState(false);
  const [isDeleteListingOpen, setIsDeleteListingOpen] = useState(false);
  const [deletingListingId, setDeletingListingId] = useState<number | null>(null);
  const [listingsPage, setListingsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [isDeleteReviewOpen, setIsDeleteReviewOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ForumThread[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SoldProperty[]>([]);
  const [filteredRolodexEntries, setFilteredRolodexEntries] = useState<RolodexEntry[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  const {
    listings,
    loading: listingsLoading,
    totalCount: listingsTotalCount,
    addListing,
    updateListing,
    deleteListing
  } = useListings(listingsPage);

  const {
    reviews,
    loading: reviewsLoading,
    totalCount: reviewsTotalCount,
    deleteReview
  } = useReviews(reviewsPage);

  const { uniqueVisitors, totalPageViews, loading: visitorStatsLoading } = useVisitorStats();

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
    } else if (session !== null) {
      setIsLoading(false);
    }
  }, [user, session]);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin && session !== null) {
      toast.error('Access denied', {
        description: 'You do not have permission to access the admin area'
      });
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate, session]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      // Use the secure RPC function that has admin privileges
      const { data: users, error } = await supabase
        .rpc('get_all_users_admin');
      
      if (error) {
        console.error('Error fetching users:', error);
        if (error.message.includes('Access denied')) {
          toast.error('Access denied. Admin privileges required.');
          return;
        }
        throw error;
      }

      setUsers(users || []);
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

      const formattedThreads = data?.map(thread => {
        // Handle the profiles object which might have different structures
        let username: string | undefined;
        if (thread.profiles && typeof thread.profiles === 'object') {
          // If it's a single object
          username = (thread.profiles as { username?: string }).username;
        }
        
        return {
          id: thread.id,
          title: thread.title,
          author_id: thread.author_id,
          date: thread.date,
          replies_count: thread.replies_count,
          excerpt: thread.excerpt,
          category: thread.category,
          author_username: username
        };
      }) || [];

      setThreads(formattedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast.error('Failed to load forum threads');
    }
  };

  // Update properties when page changes
  useEffect(() => {
    if (activeTab === 'properties') {
      fetchProperties();
    }
  }, [currentPage, activeTab]);

  // Fetch sold properties with pagination
  const fetchProperties = async () => {
    try {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, count, error } = await supabase
        .from('soldproperties')
        .select('*', { count: 'exact' })
        .order('date_added', { ascending: false })
        .range(start, end);

      if (error) throw error;
      setProperties(data || []);
      setTotalProperties(count || 0);

      // If current page is greater than total pages, reset to page 1
      const totalPages = Math.ceil((count || 0) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load sold properties');
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'forum') {
      fetchThreads();
    } else if (activeTab === 'properties') {
      fetchProperties();
    }
  }, [activeTab, isAdmin]);

  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { data, error } = await supabase
        .rpc('update_user_role', {
          target_user_id: userId,
          new_role: newRole
        });

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
        .from('replies')
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

  // Add new property
  const addProperty = async () => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase.from('soldproperties').insert([
        {
          address: newProperty.address,
          year: newProperty.year,
          city: newProperty.city,
          date_added: now,
          latest_updated: now
        }
      ]);

      if (error) throw error;

      toast.success('Property added successfully');
      setIsAddPropertyOpen(false);
      setNewProperty({ address: '', year: new Date().getFullYear(), city: '' });
      fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    }
  };

  // Edit property
  const startEditingProperty = (property: SoldProperty) => {
    setEditingProperty({
      uuid: property.uuid,
      address: property.address,
      year: property.year,
      city: property.city
    });
    setIsEditPropertyOpen(true);
  };

  const updateProperty = async () => {
    if (!editingProperty) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('soldproperties')
        .update({
          address: editingProperty.address,
          year: editingProperty.year,
          city: editingProperty.city,
          latest_updated: now
        })
        .eq('uuid', editingProperty.uuid);

      if (error) throw error;

      toast.success('Property updated successfully');
      setIsEditPropertyOpen(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  // Delete property with confirmation
  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const { error } = await supabase
        .from('soldproperties')
        .delete()
        .eq('uuid', propertyToDelete);

      if (error) throw error;

      toast.success('Property deleted');
      setPropertyToDelete(null);
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
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

  // Initialize tables
  useEffect(() => {
    const initTables = async () => {
      if (isAdmin) {
        await Promise.all([
          ensureSoldPropertiesTable(),
          ensureRolodexTable(),
          ensureListingsTable(),
          ensureReviewsTable()
        ]);
      }
    };

    initTables();
  }, [isAdmin]);

  // Fetch rolodex entries
  const fetchRolodexEntries = async () => {
    try {
      const start = (rolodexCurrentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, count, error } = await supabase
        .from('rolodex')
        .select('*', { count: 'exact' })
        .order('date_added', { ascending: false })
        .range(start, end);

      if (error) throw error;
      setRolodexEntries(data || []);
      setTotalRolodexEntries(count || 0);

      const totalPages = Math.ceil((count || 0) / itemsPerPage);
      if (rolodexCurrentPage > totalPages && totalPages > 0) {
        setRolodexCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching rolodex entries:', error);
      toast.error('Failed to load rolodex entries');
    }
  };

  // Update rolodex entries when page changes
  useEffect(() => {
    if (activeTab === 'rolodex') {
      fetchRolodexEntries();
    }
  }, [rolodexCurrentPage, activeTab]);

  // Add rolodex entry
  const addRolodexEntry = async () => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('rolodex')
        .insert({
          ...newRolodexEntry,
          date_added: now,
          last_updated: now
        });

      if (error) throw error;

      toast.success('Rolodex entry added successfully');
      setIsAddRolodexOpen(false);
      setNewRolodexEntry({
        name: '',
        company: '',
        number_1: '',
        number_2: '',
        email: '',
        notes: '',
        area: '',
        website: '',
        category: ''
      });
      fetchRolodexEntries();
    } catch (error) {
      console.error('Error adding rolodex entry:', error);
      toast.error('Failed to add rolodex entry');
    }
  };

  // Start editing rolodex entry
  const startEditingRolodex = (entry: RolodexEntry) => {
    setEditingRolodex({
      id: entry.id,
      name: entry.name || '',
      company: entry.company || '',
      number_1: entry.number_1 || '',
      number_2: entry.number_2 || '',
      email: entry.email || '',
      notes: entry.notes || '',
      area: entry.area || '',
      website: entry.website || '',
      category: entry.category || ''
    });
    setIsEditRolodexOpen(true);
  };

  // Update rolodex entry
  const updateRolodexEntry = async () => {
    if (!editingRolodex) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('rolodex')
        .update({
          ...editingRolodex,
          last_updated: now
        })
        .eq('id', editingRolodex.id);

      if (error) throw error;

      toast.success('Rolodex entry updated successfully');
      setIsEditRolodexOpen(false);
      setEditingRolodex(null);
      fetchRolodexEntries();
    } catch (error) {
      console.error('Error updating rolodex entry:', error);
      toast.error('Failed to update rolodex entry');
    }
  };

  // Delete rolodex entry
  const confirmDeleteRolodex = async () => {
    if (!rolodexToDelete) return;

    try {
      const { error } = await supabase
        .from('rolodex')
        .delete()
        .eq('id', rolodexToDelete);

      if (error) throw error;

      toast.success('Rolodex entry deleted');
      setRolodexToDelete(null);
      fetchRolodexEntries();
    } catch (error) {
      console.error('Error deleting rolodex entry:', error);
      toast.error('Failed to delete rolodex entry');
    }
  };

  // Add search filter effect for users
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(query) ||
      (user.username?.toLowerCase().includes(query)) ||
      user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Add search filter effect for threads
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredThreads(threads);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = threads.filter(thread => 
      thread.title.toLowerCase().includes(query) ||
      thread.category.toLowerCase().includes(query) ||
      (thread.author_username?.toLowerCase().includes(query))
    );
    setFilteredThreads(filtered);
  }, [searchQuery, threads]);

  // Add search filter effect for properties
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProperties(properties);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = properties.filter(property => 
      property.address.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      property.year.toString().includes(query)
    );
    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

  // Add search filter effect for rolodex entries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRolodexEntries(rolodexEntries);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = rolodexEntries.filter(entry => 
      (entry.name?.toLowerCase().includes(query)) ||
      (entry.company?.toLowerCase().includes(query)) ||
      (entry.email?.toLowerCase().includes(query)) ||
      (entry.area?.toLowerCase().includes(query)) ||
      (entry.category?.toLowerCase().includes(query))
    );
    setFilteredRolodexEntries(filtered);
  }, [searchQuery, rolodexEntries]);

  // Add search filter effect for listings
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredListings(listings);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = listings.filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.address.toLowerCase().includes(query) ||
      (listing.price?.toString().includes(query)) ||
      (listing.beds?.toString().includes(query)) ||
      (listing.baths?.toString().includes(query)) ||
      (listing.sqft?.toString().includes(query))
    );
    setFilteredListings(filtered);
  }, [searchQuery, listings]);

  // Add search filter effect for reviews
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReviews(reviews);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = reviews.filter(review => 
      (review.reviewername?.toLowerCase().includes(query)) ||
      (review.reviewerscreenname?.toLowerCase().includes(query)) ||
      (review.comment?.toLowerCase().includes(query)) ||
      (review.rating?.toString().includes(query))
    );
    setFilteredReviews(filtered);
  }, [searchQuery, reviews]);

  // Update initial states when data is loaded
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    setFilteredThreads(threads);
  }, [threads]);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    setFilteredRolodexEntries(rolodexEntries);
  }, [rolodexEntries]);

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  // Fetch total count of sold properties
  const fetchTotalSoldProperties = async () => {
    try {
      const { count, error } = await supabase
        .from('soldproperties')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalSoldProperties(count || 0);
    } catch (error) {
      console.error('Error fetching total sold properties:', error);
      toast.error('Failed to load total sold properties count');
    }
  };

  // Call fetchTotalSoldProperties when component mounts
  useEffect(() => {
    if (isAdmin) {
      fetchTotalSoldProperties();
    }
  }, [isAdmin]);

  if (isLoading || session === null) {
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
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 pt-16">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Manage your website content and users</p>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
        
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Forum Threads</CardTitle>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-gray-900">{threads.length}</div>
              <p className="text-sm text-gray-500 mt-1">Active discussions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Sold Properties</CardTitle>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-gray-900">{totalSoldProperties}</div>
              <p className="text-sm text-gray-500 mt-1">Properties sold</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Unique Visitors</CardTitle>
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-gray-900">
                {visitorStatsLoading ? '...' : uniqueVisitors.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">Unique visitors</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Page Views</CardTitle>
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-pink-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-gray-900">
                {visitorStatsLoading ? '...' : totalPageViews.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">Total page views</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border-b border-gray-100 gap-4">
              <TabsList className="bg-gray-50 p-1 rounded-xl shadow-sm">
                <TabsTrigger value="users" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="forum" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <MessageSquare className="h-4 w-4" />
                  Forum
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <Building className="h-4 w-4" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value="rolodex" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <Building className="h-4 w-4" />
                  Rolodex
                </TabsTrigger>
                <TabsTrigger value="listings" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <Building className="h-4 w-4" />
                  Listings
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <Building className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-initial">
                  <Input 
                    placeholder="Search across all data..." 
                    className="w-full lg:w-[280px] pl-4 pr-10 py-2.5 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                    >
                      ×
                    </Button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200 rounded-xl"
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="users" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1">View and manage user accounts and permissions.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="shadow-sm hover:shadow-md transition-all duration-200">
                      Export Users
                    </Button>
                    <Button className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                      <UserPlus className="h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">User</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Role</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Created</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Last Login</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-white transition-colors duration-150">
                          <TableCell className="font-medium py-4 px-6">
                            {user.username || 'No username'}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{user.email}</TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge 
                              variant={user.role === 'admin' ? 'default' : 'outline'}
                              className={user.role === 'admin' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border-gray-300 text-gray-700'}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{formatDate(user.created_at)}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{formatDate(user.last_sign_in_at)}</TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                              className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            >
                              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forum" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Forum Management</h2>
                    <p className="text-gray-600 mt-1">Manage forum threads and replies.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Title</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Author</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Category</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Replies</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredThreads.map((thread) => (
                        <TableRow key={thread.id} className="hover:bg-white transition-colors duration-150">
                          <TableCell className="font-medium py-4 px-6 max-w-md">
                            <div className="truncate">{thread.title}</div>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{thread.author_username || 'Unknown'}</TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge variant="outline" className="border-gray-300 text-gray-700">{thread.category}</Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{formatDate(thread.date)}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{thread.replies_count}</TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/forum/thread/${thread.id}`)}
                                className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                              >
                                View
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteThread(thread.id)}
                                className="hover:bg-red-600 transition-colors duration-200"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
        
            <TabsContent value="properties" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sold Properties</h2>
                    <p className="text-gray-600 mt-1">Manage sold properties displayed on the website.</p>
                  </div>
                  <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="h-4 w-4" />
                        Add Property
                      </Button>
                    </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Sold Property</DialogTitle>
                    <DialogDescription>
                      Enter the details of the sold property to add it to your portfolio.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                        className="col-span-3"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="year" className="text-right">
                        Year
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={newProperty.year}
                        onChange={(e) => setNewProperty({ ...newProperty, year: parseInt(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="city" className="text-right">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={newProperty.city}
                        onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                        className="col-span-3"
                        placeholder="Columbus"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={addProperty}
                      disabled={!newProperty.address || !newProperty.city || !newProperty.year}
                    >
                      Add Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Property Dialog */}
              <Dialog open={isEditPropertyOpen} onOpenChange={setIsEditPropertyOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Sold Property</DialogTitle>
                    <DialogDescription>
                      Update the details of this sold property.
                    </DialogDescription>
                  </DialogHeader>
                  {editingProperty && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-address" className="text-right">
                          Address
                        </Label>
                        <Input
                          id="edit-address"
                          value={editingProperty.address}
                          onChange={(e) => setEditingProperty({ ...editingProperty, address: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-year" className="text-right">
                          Year
                        </Label>
                        <Input
                          id="edit-year"
                          type="number"
                          value={editingProperty.year}
                          onChange={(e) => setEditingProperty({ ...editingProperty, year: parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-city" className="text-right">
                          City
                        </Label>
                        <Input
                          id="edit-city"
                          value={editingProperty.city}
                          onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={updateProperty}
                      disabled={!editingProperty?.address || !editingProperty?.city || !editingProperty?.year}
                    >
                      Update Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the property from your database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Address</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Year</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">City</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Date Added</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <TableRow key={property.uuid} className="hover:bg-white transition-colors duration-150">
                          <TableCell className="font-medium py-4 px-6">
                            {property.address}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{property.year}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{property.city}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{formatDate(property.date_added)}</TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditingProperty(property)}
                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setPropertyToDelete(property.uuid)}
                                className="hover:bg-red-600 transition-colors duration-200"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-center">
                  {totalProperties > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalProperties / itemsPerPage)}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rolodex" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Rolodex</h2>
                    <p className="text-gray-600 mt-1">Manage your business contacts and connections.</p>
                  </div>
                  <Dialog open={isAddRolodexOpen} onOpenChange={setIsAddRolodexOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="h-4 w-4" />
                        Add Contact
                      </Button>
                    </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>
                      Enter the contact details to add to your rolodex.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newRolodexEntry.name}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={newRolodexEntry.company}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, company: e.target.value })}
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="number_1">Primary Number</Label>
                        <Input
                          id="number_1"
                          value={newRolodexEntry.number_1}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, number_1: e.target.value })}
                          placeholder="(555) 555-5555"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="number_2">Secondary Number</Label>
                        <Input
                          id="number_2"
                          value={newRolodexEntry.number_2}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, number_2: e.target.value })}
                          placeholder="(555) 555-5555"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newRolodexEntry.email}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newRolodexEntry.website}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="area">Area</Label>
                        <Input
                          id="area"
                          value={newRolodexEntry.area}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, area: e.target.value })}
                          placeholder="Columbus"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newRolodexEntry.category}
                          onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, category: e.target.value })}
                          placeholder="Enter category"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newRolodexEntry.notes}
                        onChange={(e) => setNewRolodexEntry({ ...newRolodexEntry, notes: e.target.value })}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={addRolodexEntry}
                      disabled={!newRolodexEntry.name}
                    >
                      Add Contact
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Rolodex Dialog */}
              <Dialog open={isEditRolodexOpen} onOpenChange={setIsEditRolodexOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Contact</DialogTitle>
                    <DialogDescription>
                      Update the contact details.
                    </DialogDescription>
                  </DialogHeader>
                  {editingRolodex && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input
                            id="edit-name"
                            value={editingRolodex.name}
                            onChange={(e) => setEditingRolodex({ ...editingRolodex, name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-company">Company</Label>
                          <Input
                            id="edit-company"
                            value={editingRolodex.company}
                            onChange={(e) => setEditingRolodex({ ...editingRolodex, company: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-number-1">Primary Number</Label>
                          <Input
                            id="edit-number-1"
                            value={editingRolodex.number_1}
                            onChange={(e) => setEditingRolodex({ ...editingRolodex, number_1: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-number-2">Secondary Number</Label>
                          <Input
                            id="edit-number-2"
                            value={editingRolodex.number_2}
                            onChange={(e) => setEditingRolodex({ ...editingRolodex, number_2: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-email">Email</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editingRolodex.email}
                            onChange={(e) => setEditingRolodex({ ...editingRolodex, email: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-website">Website</Label>
                          <Input
                            id="edit-website"
                            value={editingRolodex.website}
                            onChange={(e) => setEditingRolodex({ ...editingRolodex, website: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-area">Area</Label>
                        <Input
                          id="edit-area"
                          value={editingRolodex.area}
                          onChange={(e) => setEditingRolodex({ ...editingRolodex, area: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Input
                          id="edit-category"
                          value={editingRolodex?.category}
                          onChange={(e) => setEditingRolodex({ ...editingRolodex!, category: e.target.value })}
                          placeholder="Enter category"
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={updateRolodexEntry}
                      disabled={!editingRolodex?.name}
                    >
                      Update Contact
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <AlertDialog open={!!rolodexToDelete} onOpenChange={(open) => !open && setRolodexToDelete(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this contact from your rolodex.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDeleteRolodex}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Company</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Primary Number</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Area</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Category</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRolodexEntries.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-white transition-colors duration-150">
                          <TableCell className="font-medium py-4 px-6">{entry.name}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{entry.company}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{entry.number_1}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{entry.email}</TableCell>
                          <TableCell className="py-4 px-6 text-gray-600">{entry.area}</TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge variant="outline" className="border-gray-300 text-gray-700">{entry.category}</Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditingRolodex(entry)}
                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setRolodexToDelete(entry.id)}
                                className="hover:bg-red-600 transition-colors duration-200"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-center">
                  {totalRolodexEntries > 0 && (
                    <Pagination
                      currentPage={rolodexCurrentPage}
                      totalPages={Math.ceil(totalRolodexEntries / itemsPerPage)}
                      onPageChange={setRolodexCurrentPage}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Listings</h2>
                    <p className="text-gray-600 mt-1">View and manage property listings.</p>
                  </div>
                  <Button 
                    onClick={() => setIsAddListingOpen(true)}
                    className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Listing
                  </Button>
                </div>
                
                {listingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loading message="Loading listings..." />
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 hover:bg-gray-100">
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Title</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Address</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Price</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Beds</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Baths</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Sqft</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredListings.map((listing) => (
                            <TableRow key={listing.id} className="hover:bg-white transition-colors duration-150">
                              <TableCell className="py-4 px-6 font-medium max-w-md">
                                <div className="truncate">{listing.title}</div>
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600">{listing.address}</TableCell>
                              <TableCell className="py-4 px-6 text-gray-600 font-medium">
                                {listing.price ? `$${listing.price.toLocaleString()}` : '-'}
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600">{listing.beds || '-'}</TableCell>
                              <TableCell className="py-4 px-6 text-gray-600">{listing.baths || '-'}</TableCell>
                              <TableCell className="py-4 px-6 text-gray-600">
                                {listing.sqft ? `${listing.sqft.toLocaleString()}` : '-'}
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingListing(listing);
                                      setIsEditListingOpen(true);
                                    }}
                                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      setDeletingListingId(listing.id);
                                      setIsDeleteListingOpen(true);
                                    }}
                                    className="hover:bg-red-600 transition-colors duration-200"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-center">
                      <Pagination
                        currentPage={listingsPage}
                        totalPages={Math.ceil(listingsTotalCount / 10)}
                        onPageChange={setListingsPage}
                      />
                    </div>
                  </>
                )}
              </div>

          {/* Add Listing Dialog */}
          <Dialog open={isAddListingOpen} onOpenChange={setIsAddListingOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Listing</DialogTitle>
                <DialogDescription>
                  Enter the listing details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newListing.title || ''}
                      onChange={(e) =>
                        setNewListing({ ...newListing, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newListing.address || ''}
                      onChange={(e) =>
                        setNewListing({ ...newListing, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newListing.price || ''}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          price: e.target.value ? Number(e.target.value) : null
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sqft">Square Feet</Label>
                    <Input
                      id="sqft"
                      type="number"
                      value={newListing.sqft || ''}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          sqft: e.target.value ? Number(e.target.value) : null
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="beds">Beds</Label>
                    <Input
                      id="beds"
                      type="number"
                      value={newListing.beds || ''}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          beds: e.target.value ? Number(e.target.value) : null
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="baths">Baths</Label>
                    <Input
                      id="baths"
                      type="number"
                      value={newListing.baths || ''}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          baths: e.target.value ? Number(e.target.value) : null
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zillow-link">Zillow Link</Label>
                  <Input
                    id="zillow-link"
                    value={newListing.zillow_link || ''}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        zillow_link: e.target.value
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image-link">Image Link</Label>
                  <Input
                    id="image-link"
                    value={newListing.imagelink || ''}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        imagelink: e.target.value
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewListing({
                      title: '',
                      address: '',
                      price: null,
                      beds: null,
                      baths: null,
                      last_updated_from_zillow: null,
                      sqft: null,
                      zillow_link: '',
                      imagelink: ''
                    });
                    setIsAddListingOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await addListing(newListing);
                    setNewListing({
                      title: '',
                      address: '',
                      price: null,
                      beds: null,
                      baths: null,
                      last_updated_from_zillow: null,
                      sqft: null,
                      zillow_link: '',
                      imagelink: ''
                    });
                    setIsAddListingOpen(false);
                  }}
                >
                  Add Listing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Listing Dialog */}
          <Dialog open={isEditListingOpen} onOpenChange={setIsEditListingOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Listing</DialogTitle>
                <DialogDescription>
                  Update the listing details below.
                </DialogDescription>
              </DialogHeader>
              {editingListing && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editingListing.title || ''}
                        onChange={(e) =>
                          setEditingListing({
                            ...editingListing,
                            title: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-address">Address</Label>
                      <Input
                        id="edit-address"
                        value={editingListing.address || ''}
                        onChange={(e) =>
                          setEditingListing({
                            ...editingListing,
                            address: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-price">Price</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={editingListing.price || ''}
                        onChange={(e) =>
                          setEditingListing({
                            ...editingListing,
                            price: e.target.value ? Number(e.target.value) : null
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-sqft">Square Feet</Label>
                      <Input
                        id="edit-sqft"
                        type="number"
                        value={editingListing.sqft || ''}
                        onChange={(e) =>
                          setEditingListing({
                            ...editingListing,
                            sqft: e.target.value ? Number(e.target.value) : null
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-beds">Beds</Label>
                      <Input
                        id="edit-beds"
                        type="number"
                        value={editingListing.beds || ''}
                        onChange={(e) =>
                          setEditingListing({
                            ...editingListing,
                            beds: e.target.value ? Number(e.target.value) : null
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-baths">Baths</Label>
                      <Input
                        id="edit-baths"
                        type="number"
                        value={editingListing.baths || ''}
                        onChange={(e) =>
                          setEditingListing({
                            ...editingListing,
                            baths: e.target.value ? Number(e.target.value) : null
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-zillow-link">Zillow Link</Label>
                    <Input
                      id="edit-zillow-link"
                      value={editingListing.zillow_link || ''}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          zillow_link: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-image-link">Image Link</Label>
                    <Input
                      id="edit-image-link"
                      value={editingListing.imagelink || ''}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          imagelink: e.target.value
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingListing(null);
                    setIsEditListingOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (editingListing) {
                      await updateListing(editingListing.id, editingListing);
                      setEditingListing(null);
                      setIsEditListingOpen(false);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Listing Dialog */}
          <AlertDialog open={isDeleteListingOpen} onOpenChange={setIsDeleteListingOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  listing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeletingListingId(null);
                    setIsDeleteListingOpen(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (deletingListingId) {
                      await deleteListing(deletingListingId);
                      setDeletingListingId(null);
                      setIsDeleteListingOpen(false);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Reviews</h2>
                    <p className="text-gray-600 mt-1">View and manage customer reviews.</p>
                  </div>
                </div>
                
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loading message="Loading reviews..." />
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 hover:bg-gray-100">
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Reviewer</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Rating</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Comment</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Date</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReviews.map((review) => (
                            <TableRow key={review.reviewid} className="hover:bg-white transition-colors duration-150">
                              <TableCell className="py-4 px-6 font-medium">
                                {review.reviewername || review.reviewerscreenname || 'Anonymous'}
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="font-medium">{review.rating || '-'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-6 max-w-md">
                                <div className="truncate text-gray-600">
                                  {review.comment || '-'}
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600">
                                {review.createdate
                                  ? new Date(review.createdate).toLocaleDateString()
                                  : '-'}
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setDeletingReviewId(review.reviewid);
                                    setIsDeleteReviewOpen(true);
                                  }}
                                  className="hover:bg-red-600 transition-colors duration-200"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-center">
                      <Pagination
                        currentPage={reviewsPage}
                        totalPages={Math.ceil(reviewsTotalCount / 10)}
                        onPageChange={setReviewsPage}
                      />
                    </div>
                  </>
                )}
              </div>

          {/* Delete Review Dialog */}
          <AlertDialog open={isDeleteReviewOpen} onOpenChange={setIsDeleteReviewOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  review.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDeletingReviewId(null);
                    setIsDeleteReviewOpen(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (deletingReviewId) {
                      await deleteReview(deletingReviewId);
                      setDeletingReviewId(null);
                      setIsDeleteReviewOpen(false);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
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
              <Button className="w-full sm:w-auto">
                <Shield className="h-4 w-4 mr-2" />
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