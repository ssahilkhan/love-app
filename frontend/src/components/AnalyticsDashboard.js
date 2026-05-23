import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  BarChart3, 
  Clock, 
  Target, 
  Trophy, 
  Heart, 
  Star, 
  Activity,
  Eye,
  MousePointer
} from 'lucide-react';
import loveAppService from '../services/loveAppService';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await loveAppService.getSessionAnalytics();
      if (data) {
        setAnalytics(data);
      } else {
        setError('No analytics data available');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  const getApiKeyUsageStats = () => {
    if (!analytics?.api_key_usage) return [];
    
    return Object.entries(analytics.api_key_usage).map(([key, usage]) => ({
      key,
      count: usage.length,
      lastUsed: usage.length > 0 ? usage[usage.length - 1].timestamp : null,
      actions: usage.map(u => u.action)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Loading Analytics...
            </h2>
            <p className="text-blue-700">
              Gathering your journey data 💙
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <div className="text-red-500 mb-6">
              <Activity className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              Analytics Unavailable
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button onClick={fetchAnalytics} className="bg-blue-500 hover:bg-blue-600">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <div className="text-gray-500 mb-6">
              <BarChart3 className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Analytics Data
            </h2>
            <p className="text-gray-700">
              Start your journey to see analytics here! 💙
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const apiKeyStats = getApiKeyUsageStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Journey Analytics Dashboard 📊
          </h1>
          <p className="text-purple-700 text-xl">
            Tracking your beautiful journey through our love story 💙
          </p>
        </div>

        {/* Session Overview */}
        <Card className="mb-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900">Start Time</h3>
                  <p className="text-blue-700">{formatTime(analytics.start_time)}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-900">Sections Completed</h3>
                  <p className="text-green-700 text-2xl font-bold">
                    {analytics.completed_sections?.length || 0}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-lg">
                  <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-900">Quiz Score</h3>
                  <p className="text-purple-700 text-2xl font-bold">
                    {analytics.quiz_score || 0}/5
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Usage */}
        <Card className="mb-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-purple-500" />
              Page Tracking (API Keys)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiKeyStats.map((stat) => (
                <div key={stat.key} className="border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      {stat.key}
                    </Badge>
                    <span className="text-2xl font-bold text-purple-600">
                      {stat.count}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Last used: {formatTime(stat.lastUsed)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {stat.actions.slice(0, 3).map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                    {stat.actions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{stat.actions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Page Visits */}
        <Card className="mb-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-6 w-6 text-blue-500" />
              Page Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.page_visits || {}).map(([page, visits]) => (
                <div key={page} className="text-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-lg">
                    <Star className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-pink-900 capitalize">
                      {page}
                    </h3>
                    <p className="text-pink-700 text-xl font-bold">
                      {visits}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Interactions */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-500" />
              Recent Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.interactions?.slice(-10).reverse().map((interaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{interaction.type}</p>
                    <p className="text-sm text-gray-600">{interaction.content}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">
                      {interaction.api_key || 'N/A'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(interaction.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 