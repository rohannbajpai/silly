'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserDocument, Goal } from '@/types/db';
import Blobby from '@/components/blobby/Blobby';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useBlobbyStore } from '@/lib/store/blobby';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import Link from 'next/link';
import { X, Plus, CheckCircle, PlusCircle, Award, Calendar, BarChart, Leaf, Target, ArrowRight, BookOpen, Star, MessageSquare, Zap, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserDocument | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [feedbackGoalId, setFeedbackGoalId] = useState<string | null>(null);

  // At the top of the component, add a fallbackUserData for immediate render
  const fallbackUserData: UserDocument = {
    email: 'user@example.com',
    createdAt: { toDate: () => new Date() } as any,
    onboardingCompleted: true,
    profile: {
      derivedPersona: 'Achiever',
      sillyAcronym: 'Success Is Living Life Youthfully',
      focusAreas: ['mindset', 'productivity'],
      learningStyle: 'daily',
      vibe: 'motivational',
      checkInFrequency: 'daily',
      surpriseChallenges: true
    },
    blobby: {
      unlockedAccessories: ['hat_basic', 'glasses_nerd'],
      currentOutfit: {
        hat: null,
        glasses: null
      }
    },
    stats: {
      streakDays: 5,
      xpTotal: 150,
      goalsCompleted: 24
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Try to fetch from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserDocument);
        } else {
          // Use mock data if no user data exists
          setUserData(fallbackUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Oops!',
          description: 'We had trouble loading your profile. Using demo data for now.',
          variant: 'destructive',
        });
        
        // Fall back to mock data on error
        setUserData(fallbackUserData);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, toast]);

  // Subscribe to active goals
  useEffect(() => {
    if (!user) return;

    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/goals');
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        const data = await response.json();
        setGoals(data.goals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        // Use mock goals on error
        setGoals([
          {
            id: '1',
            userId: user.uid,
            text: 'Complete project proposal',
            createdAt: { toDate: () => new Date() } as any,
            isCompleted: false,
            completedAt: null,
            dueDate: { toDate: () => new Date(Date.now() + 86400000) } as any,
            source: 'user_created'
          },
          {
            id: '2',
            userId: user.uid,
            text: 'Morning meditation for 10 minutes',
            createdAt: { toDate: () => new Date() } as any,
            isCompleted: false,
            completedAt: null,
            dueDate: { toDate: () => new Date(Date.now() + 86400000) } as any,
            source: 'suggested_daily'
          },
          {
            id: '3',
            userId: user.uid,
            text: 'Read 20 pages of my current book',
            createdAt: { toDate: () => new Date(Date.now() - 86400000) } as any,
            isCompleted: true,
            completedAt: { toDate: () => new Date() } as any,
            dueDate: { toDate: () => new Date(Date.now()) } as any,
            source: 'user_created'
          }
        ]);
      }
    };

    fetchGoals();
    // Set up polling to refresh goals every 30 seconds
    const interval = setInterval(fetchGoals, 30000);
    return () => clearInterval(interval);
  }, [user, toast]);

  const handleAddGoal = async () => {
    if (!newGoal.trim()) {
      toast({
        title: 'Oops!',
        description: 'Please enter a goal first.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Oops!',
        description: 'You need to be logged in to add a goal.',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingGoal(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newGoal.trim(),
          description: '',
          category: 'personal',
          milestones: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add goal');
      }

      setNewGoal('');
      toast({
        title: 'Nice!',
        description: 'Your goal has been added. You got this!',
      });
      
      // Celebrate with Blobby
      useBlobbyStore.setState({ status: 'CELEBRATE', duration: 3000 });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: 'Oops!',
        description: `We had trouble adding your goal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsAddingGoal(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await updateDoc(doc(db, 'goals', goalId), {
        isCompleted: true,
        completedAt: new Date(),
      });

      useBlobbyStore.setState({ status: 'CELEBRATE', duration: 3000 });
      setFeedbackGoalId(goalId);
    } catch (error) {
      console.error('Error completing goal:', error);
      toast({
        title: 'Oops!',
        description: 'We had trouble completing your goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteDoc(doc(db, 'goals', goalId));
      toast({
        title: 'Done!',
        description: 'Goal removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: 'Oops!',
        description: 'We had trouble removing your goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Replace the conditional rendering for loading
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-lg text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  // Generate calendar squares for streak visualization
  const renderCalendarSquares = () => {
    const squares = [];
    for (let i = 0; i < 7; i++) {
      const isActive = i < (userData?.stats.streakDays || 5); // Use actual streak or fallback
      squares.push(
        <div 
          key={i} 
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary' : 'bg-muted'}`}
        >
          {isActive && <CheckCircle className="text-primary-foreground" size={20} />}
        </div>
      );
    }
    return squares;
  };

  // Calculate completion rate
  const completionRate = goals.length > 0 
    ? Math.round((goals.filter(goal => goal.isCompleted).length / goals.length) * 100) 
    : 0;

  // Get active and completed goals
  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-md border border-border overflow-hidden">
          <div className="bg-primary h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
                <div className="text-2xl font-bold">{userData?.stats.streakDays || 5} days</div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-1">
              {renderCalendarSquares()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-md border border-border overflow-hidden">
          <div className="bg-warning h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Experience Points</h3>
                <div className="text-2xl font-bold">{userData?.stats.xpTotal || 150} XP</div>
              </div>
              <div className="bg-warning/10 p-3 rounded-full">
                <Zap className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Next level</span>
                <span className="font-medium">74%</span>
              </div>
              <Progress value={74} className="h-2" />
              <div className="mt-2 text-xs text-muted-foreground text-right">50 XP until Level {Math.floor((userData?.stats.xpTotal || 150) / 200) + 1}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-md border border-border overflow-hidden">
          <div className="bg-secondary h-2"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Goals Completed</h3>
                <div className="text-2xl font-bold">{userData?.stats.goalsCompleted || 24} total</div>
              </div>
              <div className="bg-secondary/10 p-3 rounded-full">
                <Target className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">This week</span>
                <span className="font-medium">{completedGoals.length} goals</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 flex-1 rounded ${i < completedGoals.length ? 'bg-secondary' : 'bg-muted'}`}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Section */}
      <Card className="bg-card shadow-md border border-border overflow-hidden">
        <div className="bg-primary h-2"></div>
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-xl font-bold">Add New Goal</CardTitle>
          <CardDescription>What would you like to achieve today?</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your goal here..."
              disabled={isAddingGoal}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
              className="flex-1"
            />
            <Button 
              onClick={handleAddGoal} 
              disabled={isAddingGoal || !newGoal.trim()}
            >
              {isAddingGoal ? 'Adding...' : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add Goal
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => setNewGoal('Complete a work task')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Work Task
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNewGoal('Exercise for 30 minutes')}>
              <Leaf className="h-4 w-4 mr-2" />
              Exercise
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNewGoal('Read for 20 minutes')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Reading
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blobby and Goal Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Blobby Character Card - Made smaller */}
        <Card className="bg-card shadow-md border border-border overflow-hidden lg:col-span-2">
          <div className="bg-primary h-2"></div>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="h-24 flex items-center justify-center">
              <Blobby
                initialState="IDLE"
                accessories={(userData || fallbackUserData)?.blobby.currentOutfit}
                onInteract={() => useBlobbyStore.getState().setStatus('WAVE')}
              />
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-muted-foreground">
                {(userData || fallbackUserData)?.profile.derivedPersona || "Achiever"}
              </p>
            </div>
            <Link href="/chat" className="w-full mt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full" 
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Goal Progress Dashboard - Now 10/12 columns */}
        <Card className="bg-card shadow-md border border-border overflow-hidden lg:col-span-10">
          <div className="bg-secondary h-2"></div>
          <CardHeader className="pt-6 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Goal Progress</CardTitle>
              <CardDescription>Your current progress across all goals</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <TrendingUp className={`h-5 w-5 ${completionRate > 50 ? 'text-success' : 'text-warning'}`} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={completionRate} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  Top Priority Goals
                </h3>
                <div className="space-y-2">
                  {activeGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center">
                        <Checkbox 
                          id={`goal-${goal.id}`}
                          className="mr-3"
                          onCheckedChange={() => handleCompleteGoal(goal.id)}
                        />
                        <span className="text-sm font-medium">{goal.text}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due {goal.dueDate ? new Date(goal.dueDate.toDate()).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                  ))}
                  {activeGoals.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground">No active goals. Add one below!</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Recently Completed
                </h3>
                <div className="space-y-2">
                  {completedGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-3 text-success" />
                        <span className="text-sm font-medium">{goal.text}</span>
                      </div>
                      <div className="rounded-full bg-success/10 text-success font-medium text-xs px-2 py-1">
                        +10 XP
                      </div>
                    </div>
                  ))}
                  {completedGoals.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground">Complete goals to see them here!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenge */}
        <Card className="bg-card shadow-md border border-border overflow-hidden lg:col-span-12">
          <div className="bg-accent h-2"></div>
          <CardHeader className="pt-6 pb-2">
            <CardTitle className="text-xl font-bold">Today's Challenge</CardTitle>
            <CardDescription>Complete these goals to earn bonus rewards</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                <div className={`rounded-full p-3 ${completedGoals.length >= 1 ? 'bg-success/20 text-success' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Complete 1 goal</h4>
                  <p className="text-xs text-muted-foreground mt-1">Reward: +5 XP</p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                <div className={`rounded-full p-3 ${completedGoals.length >= 3 ? 'bg-success/20 text-success' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Complete 3 goals</h4>
                  <p className="text-xs text-muted-foreground mt-1">Reward: +15 XP</p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                <div className={`rounded-full p-3 ${completedGoals.length >= 5 ? 'bg-success/20 text-success' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Complete 5 goals</h4>
                  <p className="text-xs text-muted-foreground mt-1">Reward: +25 XP & New Accessory</p>
                </div>
              </div>
            </div>
            
            <Progress 
              value={Math.min(completedGoals.length * 20, 100)} 
              className="h-3" 
            />
            <div className="mt-2 text-xs text-right text-muted-foreground">
              {completedGoals.length}/5 completed
            </div>
          </CardContent>
        </Card>
      </div>

      
      
      {/* Feedback Modal */}
      {feedbackGoalId && (
        <FeedbackModal
          goalId={feedbackGoalId}
          onClose={() => setFeedbackGoalId(null)}
          isOpen={!!feedbackGoalId}
        />
      )}
    </div>
  );
} 