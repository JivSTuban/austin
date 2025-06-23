import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface VisitorStats {
  uniqueVisitors: number;
  totalPageViews: number;
  loading: boolean;
}

// Function to get user's IP address (approximation using browser info)
const getBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
};

// Track a page visit
export const trackPageVisit = async (pageUrl: string) => {
  try {
    const visitorIp = getBrowserFingerprint(); // Using browser fingerprint as IP substitute
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || 'direct';
    
    const { error } = await supabase
      .from('visitors')
      .insert({
        visitor_ip: visitorIp,
        user_agent: userAgent,
        page_url: pageUrl,
        referrer: referrer
      });

    if (error) {
      console.error('Error tracking visit:', error);
    }
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
};

// Hook to get visitor statistics
export const useVisitorStats = (): VisitorStats => {
  const [stats, setStats] = useState<VisitorStats>({
    uniqueVisitors: 0,
    totalPageViews: 0,
    loading: true
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Get unique visitors count
      const { data: uniqueData, error: uniqueError } = await supabase
        .rpc('get_unique_visitors_count');

      if (uniqueError) throw uniqueError;

      // Get total page views count
      const { data: totalData, error: totalError } = await supabase
        .rpc('get_total_page_views');

      if (totalError) throw totalError;

      setStats({
        uniqueVisitors: uniqueData || 0,
        totalPageViews: totalData || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { ...stats, refetch: fetchStats };
};

// Hook to track current page visit
export const usePageTracking = (pageUrl?: string) => {
  useEffect(() => {
    const currentUrl = pageUrl || window.location.pathname;
    trackPageVisit(currentUrl);
  }, [pageUrl]);
}; 