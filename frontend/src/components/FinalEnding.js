import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Trophy, Star, Clock, Target, Crown, Sparkles, Gift } from 'lucide-react';
import loveAppService from '../services/loveAppService';

const FinalEnding = () => {
  const [finalData, setFinalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchFinalMessage();
  }, []);

  const fetchFinalMessage = async () => {
    try {
      const data = await loveAppService.getFinalMessage();
      setFinalData(data);
      setLoading(false);
      
      // Show message with typing effect
      setTimeout(() => {
        setShowMessage(true);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch final message:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Preparing Your Final Surprise...
            </h2>
            <p className="text-blue-700">
              Calculating all the beautiful moments we shared 💙
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!finalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Thank You, Hummi! 💙
            </h2>
            <p className="text-blue-700">
              Even without the final statistics, you've made this journey perfect just by being here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { message, stats, achievements } = finalData;

  const StatCard = ({ icon, label, value, color = "blue" }) => (
    <Card className={`bg-gradient-to-br from-${color}-100 to-${color}-200 border-${color}-300`}>
      <CardContent className="p-4 text-center">
        <div className={`text-${color}-600 mb-2`}>
          {icon}
        </div>
        <div className={`text-2xl font-bold text-${color}-900`}>
          {value}
        </div>
        <div className={`text-sm text-${color}-700`}>
          {label}
        </div>
      </CardContent>
    </Card>
  );

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      if (line.trim().startsWith('P.S.')) {
        return <p key={index} className="text-blue-700 italic mt-4 pl-4 border-l-4 border-blue-300">{line.trim()}</p>;
      }
      return <p key={index} className="mb-4">{line.trim()}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header with celebration */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Journey Complete! 
            </h1>
            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
          </div>
          
          <div className="flex justify-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Heart 
                key={i} 
                className="h-6 w-6 text-red-500 animate-pulse" 
                style={{ animationDelay: `${i * 0.2}s` }} 
              />
            ))}
          </div>
        </div>

        {/* Journey Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <StatCard 
            icon={<Clock className="h-8 w-8 mx-auto" />} 
            label="Time Together" 
            value={stats.timeSpent} 
            color="blue" 
          />
          <StatCard 
            icon={<Target className="h-8 w-8 mx-auto" />} 
            label="Sections Completed" 
            value={stats.sectionsCompleted} 
            color="green" 
          />
          <StatCard 
            icon={<Star className="h-8 w-8 mx-auto" />} 
            label="Quiz Score" 
            value={stats.quizScore} 
            color="purple" 
          />
          <StatCard 
            icon={<Crown className="h-8 w-8 mx-auto" />} 
            label="Rooms Visited" 
            value={stats.roomsVisited} 
            color="pink" 
          />
          <StatCard 
            icon={<Sparkles className="h-8 w-8 mx-auto" />} 
            label="Interactions" 
            value={stats.totalInteractions} 
            color="yellow" 
          />
        </div>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <Card className="mb-12 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Gift className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-purple-900 mb-2">
                  Your Achievements 🏆
                </h2>
                <p className="text-purple-700">
                  Special badges you've earned during our journey
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-purple-800 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Love Message */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <Heart className="h-10 w-10 text-red-500 animate-pulse" />
                <h2 className="text-3xl font-bold text-blue-900">
                  A Final Message From My Heart
                </h2>
                <Heart className="h-10 w-10 text-red-500 animate-pulse" />
              </div>
            </div>

            <div className={`max-w-4xl mx-auto transition-opacity duration-1000 ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
              <div 
                className="text-blue-900 leading-relaxed text-lg whitespace-pre-line"
                style={{
                  fontFamily: "'Georgia', serif",
                  lineHeight: '1.8'
                }}
              >
                {formatMessage(message)}
              </div>
            </div>

            {/* Final decoration */}
            <div className="text-center mt-12">
              <div className="flex justify-center space-x-2 mb-6">
                <Heart className="h-8 w-8 text-blue-500 animate-bounce" />
                <Heart className="h-8 w-8 text-purple-500 animate-bounce delay-100" />
                <Heart className="h-8 w-8 text-pink-500 animate-bounce delay-200" />
                <Heart className="h-8 w-8 text-red-500 animate-bounce delay-300" />
                <Heart className="h-8 w-8 text-blue-500 animate-bounce delay-400" />
              </div>
              
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg p-4">
                ✨ Forever Yours, Sahil ✨
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Floating hearts animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <Heart
              key={i}
              className="absolute h-4 w-4 text-pink-300 animate-float-heart opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${10 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalEnding;