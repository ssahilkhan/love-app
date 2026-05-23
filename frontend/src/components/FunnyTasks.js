import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Crown, Heart, Smile, Trophy, Sparkles, Star } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const FunnyTasks = ({ onComplete }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const tasks = [
    {
      id: 1,
      title: "Who's the most handsome guy in your life? 😏",
      options: [
        { text: "Fawad Khan", isCorrect: false, reaction: "Good choice but... 😅" },
        { text: "Hamza Ali Abbasi", isCorrect: false, reaction: "He's handsome but... 🤔" },
        { text: "Sahil", isCorrect: true, reaction: "CORRECT! 🎉 My heart is dancing!" },
        { text: "Shah Rukh Khan", isCorrect: false, reaction: "Bollywood hero, but I'm your real hero! 💪" }
      ],
      celebration: "🎊 A crown appears on your head! You've recognized true handsomeness! 👑"
    },
    {
      id: 2,
      title: "Your Prince is trapped in a drama. What do you do? 🏰",
      options: [
        { text: "Wait for the next episode", isCorrect: false, reaction: "But I need saving NOW! 😱" },
        { text: "Change the channel", isCorrect: false, reaction: "Don't abandon me! 😢" },
        { text: "Save him with love", isCorrect: true, reaction: "YES! You saved me, Princess Humera! 💕" },
        { text: "Ask the villain to be nice", isCorrect: false, reaction: "Villains don't listen to politeness! 😄" }
      ],
      celebration: "⚔️ You've officially been promoted to 'Hero-Saver Extraordinaire'! 🏆"
    },
    {
      id: 3,
      title: "What's Sahil's superpower when you're sad? 🦸‍♂️",
      options: [
        { text: "Flying", isCorrect: false, reaction: "I wish! But my real superpower is better 💙" },
        { text: "Making you smile", isCorrect: true, reaction: "EXACTLY! That's my only superpower and my life's mission! 😊" },
        { text: "Reading minds", isCorrect: false, reaction: "I can't read minds, but I can read your heart 💖" },
        { text: "Time travel", isCorrect: false, reaction: "I don't need time travel when every moment with you is perfect! ⏰" }
      ],
      celebration: "✨ Smile-generating powers activated! Your happiness is my superpower! 😄"
    },
    {
      id: 4,
      title: "Complete this sentence: 'Humera, you are...' 👑",
      options: [
        { text: "Just okay", isCorrect: false, reaction: "WRONG! You're way more than okay! 😤" },
        { text: "The Queen of my heart", isCorrect: true, reaction: "PERFECT! 👑 *bows down* Your Majesty!" },
        { text: "A good friend", isCorrect: false, reaction: "Friend-zone alert! 🚨 You're much more special! 💙" },
        { text: "Someone I barely know", isCorrect: false, reaction: "After all this? I'm hurt! 😭 Just kidding, you know me better! 😄" }
      ],
      celebration: "👑 Royal music plays! All hail Queen Humera! Your crown is permanent! 💎"
    },
    {
      id: 5,
      title: "What should we do on our first official hangout? 💫",
      options: [
        { text: "Watch Pakistani dramas together", isCorrect: true, reaction: "YES! I'll learn all your favorite shows! 📺💕" },
        { text: "Ignore each other", isCorrect: false, reaction: "That's literally impossible when you're around! 😍" },
        { text: "Talk about the weather", isCorrect: false, reaction: "Weather is boring when I could talk about how amazing you are! ☀️" },
        { text: "Sit in awkward silence", isCorrect: false, reaction: "Never! I have too much to tell you! 💬" }
      ],
      celebration: "🎬 Netflix party for two activated! Drama marathon with snacks and laughs! 🍿"
    }
  ];

  const handleAnswer = (optionIndex) => {
    const currentTaskData = tasks[currentTask];
    const selectedOption = currentTaskData.options[optionIndex];
    
    if (selectedOption.isCorrect) {
      setScore(score + 1);
      setCompletedTasks(prev => new Set([...prev, currentTaskData.id]));
      toast({
        title: "Correct! 🎉",
        description: selectedOption.reaction,
      });
      
      setTimeout(() => {
        setShowCelebration(true);
        toast({
          title: currentTaskData.celebration,
          description: "You're absolutely amazing! 💫",
        });
      }, 1000);
    } else {
      toast({
        title: "Not quite! 😄",
        description: selectedOption.reaction,
      });
    }

    setTimeout(() => {
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setShowCelebration(false);
      } else {
        // All tasks completed - increment currentTask to show completion screen
        setCurrentTask(currentTask + 1);
        setShowCelebration(false);
        setTimeout(() => {
          toast({
            title: "All tasks completed! 🏆",
            description: `You got ${score + (selectedOption.isCorrect ? 1 : 0)}/${tasks.length} right, but you're perfect anyway! 💙`,
          });
        }, 2000);
      }
    }, 3000);
  };

  if (currentTask >= tasks.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Trophy className="h-20 w-20 text-yellow-500" />
                <Heart className="h-8 w-8 text-red-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-purple-900 mb-6">
              Tasks Complete! 🎊
            </h1>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl mb-8">
              <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <p className="text-purple-900 text-xl mb-4">
                Final Score: {score}/{tasks.length}
              </p>
              <p className="text-purple-800 text-lg leading-relaxed">
                But you know what, Hummi? Whether you got all answers right or not, 
                you're still perfect to me. These silly questions were just my way 
                of making you smile and showing you how I see you - as my queen, 
                my princess, and the most amazing person in my world. 💜
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Badge className="bg-pink-100 text-pink-800 text-lg p-3">
                👑 Official Queen Status
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-lg p-3">
                💫 Certified Amazing
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-lg p-3">
                🎭 Drama Expert
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-lg p-3">
                💕 Heart Stealer
              </Badge>
            </div>
            
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Ready for the Grand Finale? 🎁
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTaskData = tasks[currentTask];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Smile className="h-10 w-10 text-pink-500" />
            <h1 className="text-4xl font-bold text-purple-900">Prove You're My Queen 👑</h1>
            <Sparkles className="h-10 w-10 text-purple-500" />
          </div>
          <p className="text-purple-700 text-xl mb-6">
            Fun tasks to make you giggle and crown you properly!
          </p>
          
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="outline" className="text-purple-700 border-purple-300 text-lg p-2">
              Task {currentTask + 1} of {tasks.length}
            </Badge>
            <div className="flex space-x-1">
              {tasks.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentTask ? 'bg-purple-500' : 'bg-purple-200'
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {showCelebration && (
                <div className="animate-bounce">
                  <Crown className="h-16 w-16 text-yellow-500" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-purple-900">
              {currentTaskData.title}
            </h2>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentTaskData.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-4 text-left justify-start h-auto text-wrap transition-all duration-300 hover:bg-purple-50 hover:border-purple-300 border-purple-200"
                onClick={() => handleAnswer(index)}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg text-purple-700">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1 text-purple-800">{option.text}</span>
                </div>
              </Button>
            ))}

            {showCelebration && (
              <div className="mt-8 text-center animate-fade-in">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg">
                  <Star className="h-8 w-8 text-pink-500 mx-auto mb-3 animate-spin" />
                  <p className="text-purple-800 font-semibold">
                    {currentTaskData.celebration}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-lg p-3">
            Completed: {completedTasks.size} | Score: {score}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default FunnyTasks;