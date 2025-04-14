'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Star, Medal, User, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type LeaderboardUser = {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  previousRank: number;
  xp: number;
  streak: number;
  goalsCompleted: number;
  level: number;
  badges: string[];
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // This is mock data for demonstration
    const mockLeaderboard: LeaderboardUser[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'SJ',
        rank: 1,
        previousRank: 1,
        xp: 1250,
        streak: 12,
        goalsCompleted: 42,
        level: 5,
        badges: ['streak-master', 'goal-crusher', 'early-adopter']
      },
      {
        id: '2',
        name: 'Michael Chen',
        avatar: 'MC',
        rank: 2,
        previousRank: 3,
        xp: 1120,
        streak: 8,
        goalsCompleted: 36,
        level: 4,
        badges: ['focused-learner', 'consistency-king']
      },
      {
        id: '3',
        name: user?.displayName || user?.email?.split('@')[0] || 'Current User',
        avatar: user?.email?.[0].toUpperCase() || 'U',
        rank: 3,
        previousRank: 5,
        xp: 980,
        streak: 5,
        goalsCompleted: 24,
        level: 3,
        badges: ['quick-starter']
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        avatar: 'AR',
        rank: 4,
        previousRank: 2,
        xp: 920,
        streak: 3,
        goalsCompleted: 31,
        level: 3,
        badges: ['goal-crusher']
      },
      {
        id: '5',
        name: 'Taylor Kim',
        avatar: 'TK',
        rank: 5,
        previousRank: 4,
        xp: 780,
        streak: 6,
        goalsCompleted: 22,
        level: 2,
        badges: ['mindfulness-master']
      },
      {
        id: '6',
        name: 'Jordan Smith',
        avatar: 'JS',
        rank: 6,
        previousRank: 6,
        xp: 650,
        streak: 4,
        goalsCompleted: 18,
        level: 2,
        badges: []
      },
      {
        id: '7',
        name: 'Morgan Lee',
        avatar: 'ML',
        rank: 7,
        previousRank: 8,
        xp: 520,
        streak: 2,
        goalsCompleted: 15,
        level: 1,
        badges: []
      },
    ];

    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 800);
  }, [user, timeframe]);

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="text-success h-4 w-4" />;
    } else if (current > previous) {
      return <ArrowDown className="text-destructive h-4 w-4" />;
    } else {
      return <Minus className="text-muted-foreground h-4 w-4" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'streak-master':
        return 'accent';
      case 'goal-crusher':
        return 'primary';
      case 'early-adopter':
        return 'warning';
      case 'focused-learner':
        return 'secondary';
      case 'consistency-king':
        return 'success';
      case 'mindfulness-master':
        return 'chart1';
      case 'quick-starter':
        return 'chart3';
      default:
        return 'default';
    }
  };

  const getBadgeLabel = (badge: string) => {
    return badge.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-lg text-muted-foreground">Loading leaderboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={timeframe === 'daily' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('daily')}
            size="sm"
          >
            Daily
          </Button>
          <Button 
            variant={timeframe === 'weekly' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('weekly')}
            size="sm"
          >
            Weekly
          </Button>
          <Button 
            variant={timeframe === 'monthly' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('monthly')}
            size="sm"
          >
            Monthly
          </Button>
        </div>
      </div>

      <Card className="bg-card shadow-md border border-border overflow-hidden">
        <div className="bg-primary h-2"></div>
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-xl font-bold">Goal Achievement Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-4 pl-4">Rank</th>
                  <th className="text-left pb-4">User</th>
                  <th className="text-center pb-4">Level</th>
                  <th className="text-center pb-4">XP</th>
                  <th className="text-center pb-4">Streak</th>
                  <th className="text-center pb-4">Goals</th>
                  <th className="text-right pb-4 pr-4">Badges</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`
                      border-b border-border
                      ${item.id === '3' ? 'bg-primary/5' : 'hover:bg-muted/50'}
                      transition-colors
                    `}
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.rank}</span>
                        {getRankChange(item.rank, item.previousRank)}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${index === 0 ? 'warning' : index === 1 ? 'accent' : index === 2 ? 'primary' : 'muted'} text-${index < 3 ? 'white' : 'foreground'}`}>
                          {item.avatar}
                        </div>
                        <span className="font-medium">{item.name}</span>
                        {item.id === '3' && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {item.level}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-4 w-4 text-warning" />
                        <span>{item.xp}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span>{item.streak}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-secondary" />
                        <span>{item.goalsCompleted}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <div className="flex gap-1 justify-end flex-wrap">
                        {item.badges.map((badge) => (
                          <Badge key={badge} variant={getBadgeColor(badge) as any} className="text-xs">
                            {getBadgeLabel(badge)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md border border-border overflow-hidden">
        <div className="bg-secondary h-2"></div>
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-xl font-bold">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Current Rank</h3>
                <span className="text-2xl font-bold">#3</span>
              </div>
              <p className="text-sm text-muted-foreground">You've improved 2 positions since last week!</p>
              <div className="mt-4 h-2 bg-muted-foreground/20 rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="mt-2 text-xs text-right text-muted-foreground">140 XP to rank #2</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Weekly Goals</h3>
                <span className="text-2xl font-bold">4/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Complete 3 more goals to hit your weekly target!</p>
              <div className="mt-4 h-2 bg-muted-foreground/20 rounded-full">
                <div className="h-2 bg-secondary rounded-full" style={{ width: '57%' }}></div>
              </div>
              <div className="mt-2 text-xs text-right text-muted-foreground">57% completed</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Next Badge</h3>
                <Badge variant="chart1">Consistency King</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Maintain your streak for 3 more days!</p>
              <div className="mt-4 h-2 bg-muted-foreground/20 rounded-full">
                <div className="h-2 bg-chart-1 rounded-full" style={{ width: '62%' }}></div>
              </div>
              <div className="mt-2 text-xs text-right text-muted-foreground">5/8 days completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 