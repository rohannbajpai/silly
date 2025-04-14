'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, ArrowRight, User, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          router.push('/dashboard');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-xl">SILLY</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center px-4">
        {/* Hero section */}
        <div className="max-w-4xl w-full mx-auto mt-16 md:mt-24 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Achieve Your Goals with Blobby
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SILLY helps you track, manage and accomplish your goals with a friendly AI assistant
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Example Chat UI */}
        <div className="max-w-4xl w-full mx-auto mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="bg-card shadow-md border border-border overflow-hidden lg:col-span-3">
            <div className="bg-primary h-2"></div>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full"></div>
                <Image 
                  src="/images/blobby_avatar.png" 
                  width={80} 
                  height={80} 
                  alt="Blobby"
                  className="rounded-full"
                  unoptimized
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg font-medium">Blobby</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your personal goal buddy
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-9 bg-card shadow-md border border-border overflow-hidden">
            <div className="bg-primary h-2"></div>
            <CardContent className="p-6">
              <div className="flex flex-col h-[350px] space-y-4">
                <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
                  <div className="flex items-start">
                    <div className="p-3 bg-muted rounded-lg rounded-tl-none">
                      <p>Hi there! I'm Blobby, your personal goal assistant. How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <div className="p-3 bg-primary text-primary-foreground rounded-lg rounded-tr-none">
                      <p>I need help setting up goals for my new fitness routine.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 bg-muted rounded-lg rounded-tl-none">
                      <p>I'd be happy to help with your fitness goals! Let's break it down into manageable steps. How many days per week would you like to exercise?</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="Message Blobby..."
                    className="flex-1"
                    disabled
                  />
                  <Button variant="outline" disabled>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Features section */}
        <div className="max-w-4xl w-full mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Goal Tracking</h3>
            <p className="text-muted-foreground">Set and track your goals with visual progress indicators and milestones</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">Chat with Blobby to get motivation, advice, and help with your goals</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-medium mb-2">Rewards System</h3>
            <p className="text-muted-foreground">Earn XP and rewards as you complete goals and maintain your streak</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <span className="text-primary-foreground font-bold">S</span>
              </div>
              <span className="font-bold">SILLY</span>
              <span className="text-muted-foreground ml-2 text-sm">© 2023</span>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
