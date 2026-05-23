import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import LoveJourney from './components/LoveJourney';
import Quiz from './components/Quiz';
import LoveLetter from './components/LoveLetter';
import ComfortRooms from './components/ComfortRooms';
import DramaReferences from './components/DramaReferences';
import FunnyTasks from './components/FunnyTasks';
import GiftReveal from './components/GiftReveal';
import FinalEnding from './components/FinalEnding';
import { Toaster } from './components/ui/toaster';
import loveAppService from './services/loveAppService';

function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Check if user has existing session
    if (loveAppService.hasSession()) {
      const session = await loveAppService.getSession();
      if (session) {
        setSessionData(session);
        setCompletedSections(new Set(session.completedSections || []));
        
        // Resume from where they left off
        const sections = ['journey', 'quiz', 'letter', 'comfort', 'drama', 'tasks', 'gift'];
        const lastCompleted = session.completedSections?.length || 0;
        
        if (lastCompleted >= sections.length) {
          setCurrentScreen('final');
        } else if (lastCompleted > 0) {
          setCurrentScreen(sections[lastCompleted] || 'journey');
        } else {
          setCurrentScreen('journey');
        }
        return;
      }
    }
    
    // No session, start with login
    setCurrentScreen('login');
  };

  const markSectionComplete = async (section, data = null) => {
    // Update local state
    setCompletedSections(prev => new Set([...prev, section]));
    
    // Update backend with API key tracking
    await loveAppService.updateProgress(section, true, data);
    await loveAppService.addInteraction('section_completed', `Completed ${section} section`, section);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-blue-700 text-lg">Loading your love story...</p>
            </div>
          </div>
        );
      
      case 'login':
        return <LoginScreen 
          onSuccess={(sessionData) => {
            setSessionData(sessionData);
            setCurrentScreen('journey');
          }} 
        />;
      
      case 'journey':
        return <LoveJourney 
          onComplete={async () => {
            await markSectionComplete('journey');
            setCurrentScreen('quiz');
          }} 
        />;
      
      case 'quiz':
        return <Quiz 
          onComplete={async (quizData) => {
            await markSectionComplete('quiz', quizData);
            if (quizData) {
              await loveAppService.submitQuiz(quizData.answers || [], quizData.score || 0);
            }
            setCurrentScreen('letter');
          }} 
        />;
      
      case 'letter':
        return <LoveLetter 
          onComplete={async () => {
            await markSectionComplete('letter');
            setCurrentScreen('comfort');
          }} 
        />;
      
      case 'comfort':
        return <ComfortRooms 
          onComplete={async () => {
            await markSectionComplete('comfort');
            setCurrentScreen('drama');
          }} 
        />;
      
      case 'drama':
        return <DramaReferences 
          onComplete={async () => {
            await markSectionComplete('drama');
            setCurrentScreen('tasks');
          }} 
        />;
      
      case 'tasks':
        return <FunnyTasks 
          onComplete={async () => {
            await markSectionComplete('tasks');
            setCurrentScreen('gift');
          }} 
        />;
      
      case 'gift':
        return <GiftReveal 
          completedSections={completedSections}
          onComplete={async () => {
            await markSectionComplete('gift');
            setCurrentScreen('final');
          }}
        />;
      
      case 'final':
        return <FinalEnding />;
      
      default:
        return <LoginScreen 
          onSuccess={(sessionData) => {
            setSessionData(sessionData);
            setCurrentScreen('journey');
          }} 
        />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
      <Toaster />
    </div>
  );
}

export default App;