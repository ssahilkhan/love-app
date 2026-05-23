import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent } from './ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import loveAppService from '../services/loveAppService';

const LoginScreen = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      const response = await loveAppService.createSession(password);
      
      toast({
        title: "Welcome, beautiful! ✨",
        description: response.message,
      });
      
      setTimeout(() => {
        onSuccess(response);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Not quite right... 💙",
        description: error.message || "Think about what someone special calls you",
        variant: "destructive",
      });
      setShowHint(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-500 animate-pulse" />
            <Sparkles className="h-6 w-6 text-blue-400" />
            <Heart className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              A Special Message
            </h1>
            <p className="text-blue-700 text-lg">
              For Someone Very Special ✨
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-800 mb-2 font-medium">
                What does someone special call you? 💙
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your special nickname..."
                className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                disabled={loading}
              />
              {showHint && (
                <p className="text-blue-600 text-sm mt-2 animate-fade-in">
                  💡 Hint: It's a sweet short version of your name...
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Creating Your Journey...
                </>
              ) : (
                'Unlock Your Surprise 🗝️'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-blue-600 text-sm">
              Made with 💙 by someone who thinks you're amazing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;