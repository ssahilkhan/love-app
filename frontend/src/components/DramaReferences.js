import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Tv, Heart, Star, Crown, Sparkles, Quote } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const DramaReferences = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState('main');
  const [unlockedContent, setUnlockedContent] = useState(new Set());

  const dramaContent = [
    {
      id: 'hero',
      title: 'Your Personal Drama Hero 👑',
      icon: <Crown className="h-6 w-6" />,
      description: 'Click to unlock your personal drama hero',
      content: {
        title: 'Meet Your Real-Life Hero',
        message: `"I may not be Fawad Khan or Hamza Ali Abbasi, but I'll be your hero in ways they never could. I won't just fight the villains in your story, Hummi - I'll be there for the quiet moments too. When you're crying over a drama episode, when you're laughing at the funny scenes, when you need someone to discuss plot twists with. I'm your real-life leading man, and this story is ours to write." 💙`,
        quote: "Every great drama has a hero who'd do anything for their leading lady. Consider me cast in that role, forever."
      }
    },
    {
      id: 'villain',
      title: 'Defeating Your Villains 🗡️',
      icon: <Star className="h-6 w-6" />,
      description: 'Your personal villain-fighting service',
      content: {
        title: 'Your Personal Villain Destroyer',
        message: `"In every Pakistani drama, there's always that one villain who makes life difficult for the heroine. Well, Humera, I'm here to defeat all your real-life villains - whether it's a bad day, mean people, scary thoughts, or even that one relative who asks too many questions! Consider me your drama hero who actually exists." 😄`,
        quote: "No villain - real or imaginary - stands a chance when I'm protecting my heroine."
      }
    },
    {
      id: 'romance',
      title: 'Our Love Story Script 💕',
      icon: <Heart className="h-6 w-6" />,
      description: 'Better than any drama romance',
      content: {
        title: 'Plot Twist: This Is Real',
        message: `"You know what's better than watching romantic scenes in dramas? Living them. While you're watching the hero confess his feelings on screen, I'm here confessing mine to you through this entire website. While you're watching the heroine get surprised by grand gestures, I'm surprising you right now. This isn't fiction, Hummi - this is our real love story beginning." ✨`,
        quote: "The best love stories aren't on TV - they're happening right here, right now, between us."
      }
    }
  ];

  const unlockContent = (contentId) => {
    setUnlockedContent(prev => new Set([...prev, contentId]));
    setCurrentSection(contentId);
    
    const content = dramaContent.find(item => item.id === contentId);
    toast({
      title: "Content Unlocked! 🎭",
      description: content.title,
    });
  };

  const ContentDetail = ({ content }) => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentSection('main')}
            className="mb-4 text-purple-700 border-purple-300 hover:bg-purple-50"
          >
            ← Back to Drama Corner
          </Button>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                <Crown className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-purple-900 mb-2">{content.title}</h1>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl mb-8">
              <Quote className="h-8 w-8 text-purple-600 mb-4" />
              <p className="text-purple-900 text-lg leading-relaxed italic">
                {content.message}
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <Sparkles className="h-6 w-6 text-pink-500 mx-auto mb-3" />
              <p className="text-purple-800 font-semibold">
                {content.quote}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (currentSection !== 'main') {
    const content = dramaContent.find(item => item.id === currentSection)?.content;
    return <ContentDetail content={content} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Tv className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-purple-900">Your Drama Corner 🎭</h1>
            <Sparkles className="h-10 w-10 text-pink-500" />
          </div>
          <p className="text-purple-700 text-xl mb-6">
            Since you love Pakistani dramas, here's your personal drama-inspired content!
          </p>
          <Badge variant="outline" className="text-purple-700 border-purple-300 text-lg p-2">
            Unlocked: {unlockedContent.size}/3
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {dramaContent.map((item) => (
            <Card key={item.id} className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
              unlockedContent.has(item.id) ? 'shadow-2xl ring-2 ring-purple-400 bg-gradient-to-br from-purple-100 to-pink-100' : 'shadow-lg hover:shadow-xl bg-white/80'
            } border-0 backdrop-blur-sm`}>
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 w-16 h-16 rounded-full ${
                  unlockedContent.has(item.id) ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                } flex items-center justify-center shadow-lg`}>
                  {item.icon}
                </div>
                <h2 className="text-xl font-bold text-purple-900">{item.title}</h2>
                <p className="text-purple-700 text-sm">{item.description}</p>
              </CardHeader>
              
              <CardContent className="text-center pb-8">
                <Button
                  onClick={() => unlockContent(item.id)}
                  className={`${
                    unlockedContent.has(item.id) 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
                  } text-white px-6 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105`}
                >
                  {unlockedContent.has(item.id) ? 'Read Again' : 'Unlock'}
                </Button>
                {unlockedContent.has(item.id) && (
                  <div className="mt-3">
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Content Revealed
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl mb-8 max-w-2xl mx-auto">
            <Tv className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-purple-900 text-lg leading-relaxed">
              <strong>Hummi,</strong> I know how much you love watching Pakistani dramas. 
              I may not know all the shows you watch, but I know I want to be part of your story - 
              not just as a viewer, but as someone who creates beautiful moments with you. 💜
            </p>
          </div>
          
          {unlockedContent.size === dramaContent.length && (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Ready for Fun Tasks? 🎯
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DramaReferences;