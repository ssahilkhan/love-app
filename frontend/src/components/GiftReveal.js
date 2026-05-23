import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Gift, Sparkles, Star, MessageCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const GiftReveal = ({ completedSections, onComplete }) => {
  const [currentGift, setCurrentGift] = useState(null);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [revealedGifts, setRevealedGifts] = useState(new Set());

  const gifts = [
    {
      id: 'compliment',
      title: 'Sweet Compliments 💙',
      icon: <MessageCircle className="h-6 w-6" />,
      content: [
        "Your smile brightens my entire day ✨",
        "The way you care about people is absolutely beautiful 💙",
        "Your thoughtful responses always amaze me 🌟",
        "You have this incredible way of making conversations feel special 💫",
        "Humera, you're exactly the kind of person this world needs more of 🌸"
      ]
    },
    {
      id: 'memory',
      title: 'Our Special Moments 📚',
      icon: <Heart className="h-6 w-6" />,
      content: [
        "That first conversation in 3rd year when everything clicked ✨",
        "Every time you respond with such genuine care 💙", 
        "The moment I realized how much your friendship means to me 🌟",
        "Those endless chats that I never want to end 💫",
        "Right now, creating this special surprise just for you 🎁"
      ]
    },
    {
      id: 'wishes',
      title: 'My Wishes for You 🌟',
      icon: <Star className="h-6 w-6" />,
      content: [
        "May your beautiful smile always light up the room 😊",
        "May every day bring you the happiness you deserve 💙",
        "May our friendship continue to grow and flourish 🌱",
        "May you always know how special and appreciated you are ✨",
        "May this be just the beginning of many wonderful conversations 💫"
      ]
    }
  ];

  const revealGift = (giftId) => {
    const gift = gifts.find(g => g.id === giftId);
    setCurrentGift(gift);
    setRevealedGifts(prev => new Set([...prev, giftId]));
    
    toast({
      title: `${gift.title} Unlocked! 🎁`,
      description: "Something special is waiting for you...",
    });
  };

  const showFinal = () => {
    setShowFinalMessage(true);
    toast({
      title: "💙 Thank you for being amazing, Humera!",
      description: "This is just the beginning...",
    });
    
    // After showing final message, proceed to the ending
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 8000);
  };

  const GiftCard = ({ gift, isRevealed }) => (
    <Card className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
      isRevealed ? 'shadow-2xl bg-gradient-to-br from-blue-50 to-white' : 'shadow-lg hover:shadow-xl'
    } border-0`}>
      <CardContent className="p-6 text-center">
        <div className={`mb-4 ${isRevealed ? 'text-blue-600' : 'text-gray-400'}`}>
          {gift.icon}
        </div>
        <h3 className="font-bold text-lg text-blue-900 mb-2">{gift.title}</h3>
        {!isRevealed ? (
          <Button 
            onClick={() => revealGift(gift.id)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Gift className="h-4 w-4 mr-2" />
            Unwrap Gift
          </Button>
        ) : (
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            ✨ Revealed
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  if (showFinalMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="text-center p-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Heart className="h-20 w-20 text-blue-500 animate-pulse" />
                <Sparkles className="h-8 w-8 text-blue-400 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-blue-900 mb-6">
              Thank You, Humera 💙
            </h1>
            
            <div className="max-w-2xl mx-auto space-y-6 text-blue-800 text-lg leading-relaxed">
              <p>
                Thank you for taking this journey with me. Every click, every revealed gift, 
                every moment you spent here means the world to me.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl">
                <p className="font-semibold text-xl text-blue-900 mb-4">
                  "Humera, you are exactly what your name represents - 
                  a beautiful smile with reddish cheeks, bringing joy wherever you go." 🌸
                </p>
                <p className="text-blue-700">
                  I hope this little web app brought a smile to your face, just like you bring 
                  smiles to mine every single day through our conversations.
                </p>
              </div>
              
              <p>
                This is my way of saying thank you for being the wonderful person you are, 
                and I'm excited to continue getting to know you better, Humera. 💫
              </p>
              
              <div className="flex justify-center space-x-2 pt-6">
                <Heart className="h-8 w-8 text-blue-500 animate-bounce" />
                <Heart className="h-8 w-8 text-blue-600 animate-bounce delay-100" />
                <Heart className="h-8 w-8 text-blue-500 animate-bounce delay-200" />
              </div>
              
              {onComplete && (
                <div className="mt-8">
                  <p className="text-blue-700 text-center mb-4">
                    But wait... there's one final surprise waiting for you! ✨
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentGift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentGift(null)}
              className="mb-4 text-blue-700 border-blue-300 hover:bg-blue-50"
            >
              ← Back to Gifts
            </Button>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">{currentGift.title}</h1>
          </div>

          <div className="space-y-6">
            {currentGift.content.map((item, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-blue-800 text-lg leading-relaxed flex-1">{item}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            {revealedGifts.size === gifts.length ? (
              <Button
                onClick={showFinal}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                One Final Message 💌
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentGift(null)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Explore More Gifts 🎁
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Your Special Gifts 🎁</h1>
          <p className="text-blue-700 text-xl mb-6">
            You've completed this beautiful journey - now it's time for your surprises!
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            {['journey', 'quiz', 'letter'].map((section) => (
              <Badge 
                key={section}
                variant={completedSections.has(section) ? "default" : "secondary"}
                className={completedSections.has(section) ? "bg-blue-500 text-white" : ""}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)} ✓
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {gifts.map((gift) => (
            <GiftCard 
              key={gift.id} 
              gift={gift} 
              isRevealed={revealedGifts.has(gift.id)} 
            />
          ))}
        </div>

        {revealedGifts.size > 0 && (
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-blue-500 animate-spin" />
              <p className="text-blue-700 text-lg">
                {revealedGifts.size === gifts.length ? 
                  "All gifts revealed! Ready for the final surprise?" : 
                  `${revealedGifts.size}/${gifts.length} gifts revealed`
                }
              </p>
              <Sparkles className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
            
            {revealedGifts.size === gifts.length && (
              <Button
                onClick={showFinal}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 text-xl font-semibold transition-all duration-300 transform hover:scale-110 shadow-2xl"
              >
                ✨ Final Message ✨
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftReveal;