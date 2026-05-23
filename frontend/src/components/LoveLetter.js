import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Heart, Sparkles } from 'lucide-react';

const LoveLetter = ({ onComplete }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showFullLetter, setShowFullLetter] = useState(false);

  const letterParts = [
    "Dear Humera,",
    "",
    "I hope this message finds you with that beautiful smile of yours - the one that perfectly matches what 'Tabassum' means. 😊",
    "",
    "You know, when I learned that 'Humera' means reddish cheeks and 'Tabassum' means smile, I couldn't help but think how perfectly your name describes you - a beautiful smile with reddish cheeks. How amazing is that? 💙",
    "",
    "I want you to know something important...",
    "",
    "In our first year of college, I was dealing with so many personal issues that I couldn't see the wonderful person right there in front of me. But life has a funny way of bringing people back together when the time is right.",
    "",
    "When we started talking again in our third year, everything changed for me. Suddenly, conversations didn't feel like just conversations anymore - they felt like coming home. I find myself wanting to talk with you continuously, and honestly, there's still so much I want to know about you.",
    "",
    "What impresses me most about you, Humera, is how you express yourself. The way you care about me, how well you respond to everything - it's beautiful. You have this incredible way of making me feel heard and understood.",
    "",
    "I feel so pleasant whenever we chat. You bring out something in me that I didn't even know existed - a sense of peace and genuine happiness.",
    "",
    "This web application might seem like just code and design, but every line, every color (especially that blue that connects us 💙), every animation - it's all my way of saying thank you. Thank you for being exactly who you are.",
    "",
    "You're special, Humera. More special than you probably realize.",
    "",
    "With all my care and warmth,",
    "Someone who thinks you're amazing ✨"
  ];

  useEffect(() => {
    if (currentTextIndex < letterParts.length && !showFullLetter) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + letterParts[currentTextIndex] + '\n');
        setCurrentTextIndex(prev => prev + 1);
      }, 800); // Faster typing speed for better testing
      
      return () => clearTimeout(timer);
    } else if (currentTextIndex >= letterParts.length) {
      setTimeout(() => {
        setShowFullLetter(true);
      }, 2000);
    }
  }, [currentTextIndex, showFullLetter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-blue-500 animate-pulse" />
            <h1 className="text-4xl font-bold text-blue-900">A Letter for You 💌</h1>
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-blue-700 text-xl">Written from the heart...</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="relative">
              <div 
                className="text-blue-900 leading-relaxed text-lg font-medium whitespace-pre-line min-h-[500px]"
                style={{
                  fontFamily: "'Georgia', serif",
                  lineHeight: '1.8'
                }}
              >
                {displayedText}
                {currentTextIndex < letterParts.length && (
                  <span className="inline-block w-3 h-6 bg-blue-500 animate-pulse ml-1"></span>
                )}
              </div>

              {showFullLetter && (
                <div className="text-center mt-12 animate-fade-in">
                  <div className="flex justify-center space-x-2 mb-6">
                    <Heart className="h-6 w-6 text-blue-500 animate-bounce" />
                    <Heart className="h-6 w-6 text-blue-600 animate-bounce delay-100" />
                    <Heart className="h-6 w-6 text-blue-500 animate-bounce delay-200" />
                  </div>
                  
                  <Button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    There's One More Surprise 🎁
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Floating hearts animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute h-4 w-4 text-blue-300 animate-float-heart opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveLetter;