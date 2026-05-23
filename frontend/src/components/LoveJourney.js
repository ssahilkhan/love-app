import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Heart, MapPin, Calendar, Sparkles } from 'lucide-react';

const LoveJourney = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const timelineData = [
    {
      year: "1st Year BTech",
      title: "First Encounter 🎓",
      description: "We met in college, but life had different plans for both of us. Sometimes the best things come when we're not looking for them.",
      icon: <MapPin className="h-5 w-5" />,
      color: "from-blue-400 to-blue-500"
    },
    {
      year: "Between Years",
      title: "Life's Challenges 💪",
      description: "Personal struggles kept me distant, but you were always there - a constant, gentle presence I didn't fully appreciate then.",
      icon: <Heart className="h-5 w-5" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "3rd Year",
      title: "Reconnection ✨",
      description: "When we started talking again, everything changed. Suddenly, conversations felt like coming home.",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-blue-600 to-blue-700"
    },
    {
      year: "Present",
      title: "Endless Conversations 💙",
      description: "Now I can't imagine a day without talking to you. There's so much more I want to know about you, Humera.",
      icon: <Calendar className="h-5 w-5" />,
      color: "from-blue-700 to-blue-800"
    }
  ];

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const nextStep = () => {
    if (currentStep < timelineData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Journey 💙</h1>
          <p className="text-blue-700 text-xl">From strangers to... something beautiful</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-blue-200 to-blue-400"></div>

          {/* Timeline steps */}
          {timelineData.map((step, index) => (
            <div
              key={index}
              className={`relative flex items-center mb-16 transition-all duration-1000 delay-${index * 200} ${
                index <= currentStep ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-8'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} border-4 border-white shadow-lg z-10 flex items-center justify-center text-white`}>
                {step.icon}
              </div>

              {/* Content card */}
              <Card className={`w-5/12 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${step.color}`}>
                      {step.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{step.title}</h3>
                  <p className="text-blue-700 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={nextStep}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            {currentStep < timelineData.length - 1 ? 'Continue Our Story 💙' : 'Ready for More? 🎯'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoveJourney;