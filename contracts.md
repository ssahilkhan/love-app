# Backend Integration Contracts

## API Contracts

### 1. User Session Management
```
POST /api/sessions
- Create new session for user
- Body: { nickname: string }
- Response: { sessionId: string, message: string }

GET /api/sessions/:sessionId
- Get session details
- Response: { sessionId, nickname, completedSections: [], startTime, lastActivity }
```

### 2. Progress Tracking
```
PUT /api/sessions/:sessionId/progress
- Update user progress through sections
- Body: { section: string, completed: boolean, data?: any }
- Response: { success: boolean, completedSections: string[] }
```

### 3. Quiz Responses
```
POST /api/sessions/:sessionId/quiz
- Save quiz answers
- Body: { answers: { questionId: number, answer: number, isCorrect: boolean }[], score: number }
- Response: { success: boolean, finalScore: number }
```

### 4. Room Visits
```
POST /api/sessions/:sessionId/rooms
- Track comfort room visits
- Body: { roomId: string, visitTime: Date }
- Response: { success: boolean, totalVisits: number }
```

### 5. Interactions Tracking
```
POST /api/sessions/:sessionId/interactions
- Track user interactions (button clicks, unlocks, etc.)
- Body: { type: string, content: string, timestamp: Date }
- Response: { success: boolean }
```

### 6. Final Message
```
GET /api/sessions/:sessionId/final
- Get personalized final message based on user journey
- Response: { message: string, stats: object, achievements: string[] }
```

## Data Models

### Session Model
```javascript
{
  _id: ObjectId,
  sessionId: string (unique),
  nickname: string,
  startTime: Date,
  lastActivity: Date,
  completedSections: [string],
  quizScore: number,
  roomsVisited: [string],
  interactions: [{
    type: string,
    content: string,
    timestamp: Date
  }],
  isCompleted: boolean
}
```

## Frontend Integration Points

### Mock Data to Replace:
1. **Login validation** - Replace hardcoded "hummi" check with API call
2. **Progress tracking** - Save section completions to backend
3. **Quiz results** - Store answers and score
4. **Room visits** - Track which comfort rooms were entered
5. **Final statistics** - Generate personalized end message based on journey

### New Features to Add:
1. **Session persistence** - User can resume where they left off
2. **Journey statistics** - Time spent, sections completed, interactions
3. **Personalized ending** - Dynamic final message based on user behavior
4. **Achievement system** - Unlock badges based on interactions

## Implementation Plan:

1. **Backend Models**: Session, Progress, Quiz, Interactions
2. **API Endpoints**: CRUD operations for user journey
3. **Frontend Updates**: Replace mock data with API calls
4. **Final Screen**: Comprehensive ending with statistics and personalized message
5. **Error Handling**: Graceful fallbacks if backend unavailable