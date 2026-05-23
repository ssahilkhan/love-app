# API Keys Documentation

## Overview
This application uses a comprehensive API key system to track user interactions, page visits, and section completions. Each page/section has a unique API key that helps identify and trace user behavior for debugging and improvement purposes.

## API Keys List

| Page/Section | API Key | Description |
|--------------|---------|-------------|
| Login | `LOGIN_001` | User login and session creation |
| Journey | `JOURNEY_002` | Love journey story section |
| Quiz | `QUIZ_003` | Quiz questions and answers |
| Letter | `LETTER_004` | Love letter section |
| Comfort | `COMFORT_005` | Comfort rooms visits |
| Drama | `DRAMA_006` | Drama references section |
| Tasks | `TASKS_007` | Funny tasks completion |
| Gift | `GIFT_008` | Gift reveal section |
| Final | `FINAL_009` | Final ending and analytics |

## Tracking Features

### 1. Page Visits
- Tracks how many times each page was visited
- Records timestamps for each visit
- Stores in `pageVisits` object

### 2. API Key Usage
- Records every interaction with API key context
- Stores action types, timestamps, and additional data
- Tracks usage patterns for each page

### 3. Session Analytics
- Comprehensive analytics endpoint: `/api/sessions/{session_id}/analytics`
- Includes all tracking data in one response
- Useful for debugging and improvement analysis

## API Endpoints

### Get All API Keys
```
GET /api/api-keys
```
Returns all available API keys and their descriptions.

### Session Analytics
```
GET /api/sessions/{session_id}/analytics
```
Returns detailed analytics including:
- Session overview
- Page visits count
- API key usage statistics
- Recent interactions
- Completion status

### Enhanced Endpoints
All existing endpoints now include API key tracking:
- `POST /api/sessions` - Tracks login with `LOGIN_001`
- `PUT /api/sessions/{session_id}/progress` - Tracks section completion
- `POST /api/sessions/{session_id}/quiz` - Tracks quiz submission
- `POST /api/sessions/{session_id}/rooms` - Tracks room visits
- `POST /api/sessions/{session_id}/interactions` - Tracks user interactions
- `GET /api/sessions/{session_id}/final` - Tracks final page view

## Usage Examples

### Frontend Service Usage
```javascript
// Update progress with API key
await loveAppService.updateProgress('journey', true, data);

// Add interaction with page context
await loveAppService.addInteraction('button_click', 'Clicked start button', 'journey');

// Get analytics
const analytics = await loveAppService.getSessionAnalytics();
```

### Backend Response Example
```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "nickname": "hummi",
  "start_time": "2024-01-15T10:30:00Z",
  "last_activity": "2024-01-15T11:45:00Z",
  "completed_sections": ["journey", "quiz", "letter"],
  "quiz_score": 4,
  "rooms_visited": ["comfort_room_1", "comfort_room_2"],
  "total_interactions": 15,
  "page_visits": {
    "journey": 2,
    "quiz": 1,
    "letter": 1
  },
  "api_key_usage": {
    "JOURNEY_002": [
      {
        "timestamp": "2024-01-15T10:35:00Z",
        "page": "journey",
        "action": "progress_updated",
        "data": {"completed": true}
      }
    ],
    "QUIZ_003": [
      {
        "timestamp": "2024-01-15T10:40:00Z",
        "page": "quiz",
        "action": "quiz_submitted",
        "data": {"score": 4, "total_questions": 5}
      }
    ]
  },
  "is_completed": false
}
```

## Benefits

### 1. Debugging
- Easy identification of which pages are causing issues
- Track user flow through the application
- Identify bottlenecks or problematic sections

### 2. Analytics
- Understand user behavior patterns
- Measure engagement with different sections
- Track completion rates

### 3. Improvements
- Identify areas that need enhancement
- Understand user preferences
- Optimize user experience

## Implementation Notes

### Backend
- API keys are stored in `PAGE_API_KEYS` dictionary
- Tracking is handled by `track_api_key_usage()` function
- All endpoints return API key information in responses

### Frontend
- API keys are defined in `loveAppService.js`
- Automatic tracking when using service methods
- Analytics dashboard component available for viewing data

### Data Storage
- All tracking data is stored in memory (sessions_db)
- No external database required
- Data persists for the duration of the session

## Troubleshooting

### Common Issues
1. **API key not found**: Check if the page/section exists in `PAGE_API_KEYS`
2. **No tracking data**: Ensure the session is active and valid
3. **Analytics not loading**: Check if the session has any interactions

### Debug Commands
```bash
# Check API keys
curl http://localhost:8000/api/api-keys

# Get session analytics
curl http://localhost:8000/api/sessions/{session_id}/analytics

# Check session status
curl http://localhost:8000/api/sessions/{session_id}
```

This API key system provides comprehensive tracking capabilities while maintaining simplicity and ease of use for debugging and improvement purposes. 