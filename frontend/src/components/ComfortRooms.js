import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Cloud, Zap, Ghost, Shield, Heart, Sparkles, Home } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import loveAppService from '../services/loveAppService';

const ComfortRooms = ({ onComplete }) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [visitedRooms, setVisitedRooms] = useState(new Set());
  const [showThunder, setShowThunder] = useState(false);
  const [ghostsDefeated, setGhostsDefeated] = useState(0);

  const rooms = [
    {
      id: 'thunder',
      title: 'Thunder Protection Room 🌩️',
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      description: 'A safe space for when storms feel scary',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'ghost',
      title: 'Ghost Defender Zone 👻',
      icon: <Ghost className="h-8 w-8 text-purple-400" />,
      description: 'Where I defeat all your spooky fears',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  useEffect(() => {
    if (currentRoom === 'thunder') {
      const thunderInterval = setInterval(() => {
        setShowThunder(true);
        setTimeout(() => setShowThunder(false), 200);
      }, 3000);

      return () => clearInterval(thunderInterval);
    }
  }, [currentRoom]);

  const enterRoom = async (roomId) => {
    setCurrentRoom(roomId);
    setVisitedRooms(prev => new Set([...prev, roomId]));
    
    // Track room visit in backend
    await loveAppService.visitRoom(roomId);
    await loveAppService.addInteraction('room_entered', `Entered ${roomId} comfort room`);
    
    if (roomId === 'thunder') {
      toast({
        title: "Welcome to your safe space 🌩️",
        description: "You're protected here, Hummi...",
      });
    } else if (roomId === 'ghost') {
      toast({
        title: "Ghost Defender activated! 👻",
        description: "Time to defeat some spooky fears!",
      });
    }
  };

  const defeatGhost = async () => {
    setGhostsDefeated(prev => prev + 1);
    await loveAppService.addInteraction('ghost_defeated', `Defeated ghost #${ghostsDefeated + 1}`);
    
    toast({
      title: `Ghost defeated! 💪`,
      description: `${ghostsDefeated + 1} ghosts banished for you, Hummi!`,
    });
  };

  const ThunderRoom = () => (
    <div className={`min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 p-4 transition-all duration-300 ${showThunder ? 'brightness-150' : ''}`}>
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentRoom(null)}
            className="mb-4 text-white border-white/30 hover:bg-white/10"
          >
            ← Back to Comfort Zone
          </Button>
          <h1 className="text-4xl font-bold text-white mb-4">Thunder Protection Room 🌩️</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-8">
          <CardContent className="p-8 text-center">
            <div className="relative mb-8">
              {/* Animated rain effect */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-20 bg-blue-200 opacity-30 animate-rain"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Cozy room illustration */}
              <div className="relative z-10 bg-amber-100 rounded-2xl p-6 mx-auto max-w-md">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <Home className="h-12 w-12 text-amber-700" />
                  <Heart className="h-8 w-8 text-red-500 animate-pulse" />
                </div>
                <p className="text-amber-800 font-medium">Cozy Safe Space</p>
              </div>
            </div>

            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-blue-100">
                🌩️ <strong>Listen, Hummi...</strong>
              </p>
              <p>
                Every time thunder scares you, I want you to remember this moment. 
                Imagine me sitting right beside you, holding your hand tightly.
              </p>
              <p>
                <em>"You're safe with me. Thunder is just nature's way of showing power, 
                but you have something more powerful - a heart that's brave, even when it doesn't feel like it."</em>
              </p>
              <div className="bg-blue-900/30 p-6 rounded-lg">
                <Shield className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                <p className="font-semibold">
                  Promise: Whenever you're scared, think of this room. 
                  I'm your shield against every storm, Humera. 💙
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showThunder && (
          <div className="text-center">
            <p className="text-yellow-200 text-xl animate-pulse">⚡ Thunder rumbles... but you're protected! ⚡</p>
          </div>
        )}
      </div>
    </div>
  );

  const GhostRoom = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentRoom(null)}
            className="mb-4 text-purple-200 border-purple-300 hover:bg-purple-800"
          >
            ← Back to Comfort Zone
          </Button>
          <h1 className="text-4xl font-bold text-purple-100 mb-4">Ghost Defender Zone 👻</h1>
        </div>

        <Card className="bg-purple-800/20 backdrop-blur-md border-purple-500/30 text-purple-100 mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <Badge className="bg-purple-600 text-white text-lg p-2 mb-4">
                Ghosts Defeated: {ghostsDefeated} 💪
              </Badge>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                {[...Array(8)].map((_, i) => (
                  <Button
                    key={i}
                    onClick={defeatGhost}
                    className="h-20 bg-purple-700/50 hover:bg-purple-600 border-purple-400 text-white transform hover:scale-110 transition-all duration-300"
                  >
                    <Ghost className="h-8 w-8" />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-purple-200">
                👻 <strong>Hey brave girl!</strong>
              </p>
              <p>
                Click on the ghosts above to defeat them! Every time you're scared 
                of something spooky, remember - I'm your personal ghost hunter.
              </p>
              <div className="bg-purple-900/40 p-6 rounded-lg">
                <Sparkles className="h-8 w-8 text-purple-300 mx-auto mb-3" />
                <p className="font-semibold">
                  <em>"I'll fight all your fears, silly or serious. You're never alone 
                  in the dark when you have someone who cares about you this much."</em>
                </p>
              </div>
              <p>
                No ghost, no fear, no darkness is stronger than the light you bring 
                to my life, Hummi. You're braver than you think! 💜
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (currentRoom === 'thunder') {
    return <ThunderRoom />;
  }

  if (currentRoom === 'ghost') {
    return <GhostRoom />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Your Personal Comfort Zone 🏠</h1>
          <p className="text-blue-700 text-xl">
            Safe spaces designed just for you, whenever you need support
          </p>
          <div className="flex justify-center mt-6">
            <Badge variant="outline" className="text-blue-700 border-blue-300 text-lg p-2">
              Rooms visited: {visitedRooms.size}/2
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {rooms.map((room) => (
            <Card key={room.id} className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
              visitedRooms.has(room.id) ? 'shadow-2xl ring-2 ring-blue-400' : 'shadow-lg hover:shadow-xl'
            } border-0 bg-white/80 backdrop-blur-sm`}>
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r ${room.color} flex items-center justify-center shadow-lg`}>
                  {room.icon}
                </div>
                <h2 className="text-2xl font-bold text-blue-900">{room.title}</h2>
                <p className="text-blue-700">{room.description}</p>
              </CardHeader>
              
              <CardContent className="text-center pb-8">
                <Button
                  onClick={() => enterRoom(room.id)}
                  className={`bg-gradient-to-r ${room.color} hover:shadow-lg text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105`}
                >
                  {visitedRooms.has(room.id) ? 'Visit Again' : 'Enter Room'}
                </Button>
                {visitedRooms.has(room.id) && (
                  <div className="mt-3">
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Comfort Received
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-2xl mb-8 max-w-2xl mx-auto">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4 animate-pulse" />
            <p className="text-blue-900 text-lg leading-relaxed">
              <strong>Remember, Hummi:</strong> I want to be your support system. 
              Whenever life feels overwhelming, scary, or difficult - I'm here. 
              These rooms represent my promise to stand by you through everything. 💙
            </p>
          </div>
          
          {visitedRooms.size === rooms.length && (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Continue Your Journey 💫
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComfortRooms;