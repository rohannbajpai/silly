'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Home, 
  Trophy, 
  Calendar, 
  Settings, 
  LogOut, 
  BookOpen, 
  Users, 
  Bell,
  MessageSquare 
} from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-20 bg-sidebar text-sidebar-foreground flex flex-col items-center pt-6 pb-4">
        <div className="mb-8">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary font-heading font-bold text-2xl">S</span>
          </div>
        </div>
        
        <nav className="flex-1 w-full">
          <ul className="flex flex-col items-center space-y-6">
            <li>
              <Link href="/dashboard" className="p-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
                <Home size={24} />
              </Link>
            </li>
            <li>
              <Link href="#" className="p-3 rounded-lg hover:bg-sidebar-primary/80 text-sidebar-foreground flex items-center justify-center">
                <BookOpen size={24} />
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" className="p-3 rounded-lg hover:bg-sidebar-primary/80 text-sidebar-foreground flex items-center justify-center">
                <Trophy size={24} />
              </Link>
            </li>
            <li>
              <Link href="#" className="p-3 rounded-lg hover:bg-sidebar-primary/80 text-sidebar-foreground flex items-center justify-center">
                <Users size={24} />
              </Link>
            </li>
            <li>
              <Link href="/chat" className="p-3 rounded-lg hover:bg-sidebar-primary/80 text-sidebar-foreground flex items-center justify-center">
                <MessageSquare size={24} />
              </Link>
            </li>
          </ul>
        </nav>
        
        <button 
          onClick={handleSignOut}
          className="mt-auto p-3 rounded-lg hover:bg-sidebar-primary/80 text-sidebar-foreground flex items-center justify-center"
        >
          <LogOut size={24} />
        </button>
      </aside>
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-card-foreground">SILLY</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Streak count */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Calendar size={16} className="text-accent-foreground" />
              </div>
              <span className="font-medium">5</span>
            </div>
            
            {/* XP count */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Trophy size={16} className="text-secondary-foreground" />
              </div>
              <span className="font-medium">150 XP</span>
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-destructive rounded-full text-destructive-foreground text-xs flex items-center justify-center">3</span>
            </button>
            
            {/* User profile */}
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 