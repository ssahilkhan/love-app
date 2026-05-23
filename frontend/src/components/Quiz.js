import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import loveAppService from '../services/loveAppService';

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    {
      question: "When did I first realize I liked you?",
      options: [
        "During our chats in 3rd year",
        "When I first saw you in 1st year", 
        "During a college event",
        "When you helped me with studies"
      ],
      correct: 0,
      explanation: "It was during our conversations in 3rd year that I realized how amazing you are! ✨"
    },
    {
      question: "What's my favorite thing about you?",
      options: [
        "Your intelligence",
        "How you care about me and respond so well",
        "Your sense of humor", 
        "Your style"
      ],
      correct: 1,
      explanation: "I love how you care about me and always respond so thoughtfully to everything I say 💙"
    },
    {
      question: "What color connects us?",
      options: [
        "Red",
        "Blue", 
        "Pink",
        "Purple"
      ],
      correct: 1,
      explanation: "Blue! It's the color that connects our hearts 💙"
    },
    {
      question: "What does your name 'Humera' mean?",
      options: [
        "Beautiful eyes",
        "Reddish cheeks",
        "Sweet voice", 
        "Kind heart"
      ],
      correct: 1,
      explanation: "Humera means reddish cheeks - and combined with Tabassum (smile), it's perfect! Beautiful smile with reddish cheeks 😊"
    },
    {
      question: "How do I feel about our endless conversations?",
      options: [
        "They're okay",
        "I enjoy them sometimes",
        "I feel very pleasant and want to talk continuously",
        "They're helpful for studies"
      ],
      correct: 2,
      explanation: "I feel so pleasant talking with you and honestly, I want to talk with you continuously! There's still so much I want to know about you 💫"
    }
  ];

  const handleAnswerSelect = async (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }));
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
      toast({
        title: "Correct! 💙",
        description: questions[currentQuestion].explanation,
      });
    } else {
      toast({
        title: "Not quite, but... 💙",
        description: questions[currentQuestion].explanation,
      });
    }

    // Track answer selection
    await loveAppService.addInteraction('quiz_answer', `Question ${currentQuestion + 1}: ${answerIndex === questions[currentQuestion].correct ? 'Correct' : 'Incorrect'}`);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleComplete = async () => {
    toast({
      title: "You know me so well! 💙",
      description: `You got ${score}/${questions.length} questions right, but that's not what matters...`,
    });
    
    // Track quiz completion
    await loveAppService.addInteraction('quiz_completed', `Completed quiz with score ${score}/${questions.length}`);
    
    setTimeout(() => {
      onComplete({ 
        answers: questions.map((q, index) => ({
          questionId: index,
          answer: selectedAnswers[index] || 0,
          isCorrect: (selectedAnswers[index] || 0) === q.correct
        })),
        score: score 
      });
    }, 2000);
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center p-8">
            <div className="flex justify-center mb-6">
              <Heart className="h-16 w-16 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Quiz Complete! 🎉</h2>
            <p className="text-blue-700 text-xl mb-6">
              You scored {score}/{questions.length}
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-blue-800 text-lg leading-relaxed">
                But you know what, Humera? The score doesn't matter. What matters is that 
                <strong> you're perfect just the way you are</strong>, and I'm grateful 
                for every conversation we share. 💙
              </p>
            </div>
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Continue to Something Special 💌
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">How Well Do You Know Me? 💙</h1>
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <div className="flex space-x-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentQuestion ? 'bg-blue-500' : 'bg-blue-200'
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center">
              {questions[currentQuestion].question}
            </h2>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant={showResult ? (
                  index === questions[currentQuestion].correct ? "default" : 
                  index === selectedAnswer ? "destructive" : "outline"
                ) : "outline"}
                className={`w-full p-4 text-left justify-start h-auto text-wrap transition-all duration-300 ${
                  !showResult ? 'hover:bg-blue-50 hover:border-blue-300' : ''
                } ${showResult && index === questions[currentQuestion].correct ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                ${showResult && index === selectedAnswer && index !== questions[currentQuestion].correct ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === questions[currentQuestion].correct && (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  {showResult && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
              </Button>
            ))}

            {showResult && (
              <div className="mt-8 text-center">
                <Button
                  onClick={nextQuestion}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question 🔄' : 'See Results 🎯'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;