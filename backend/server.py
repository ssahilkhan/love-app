from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import json
import os

# In-memory storage for development
sessions_db = {}
api_keys_db = {}

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# API Keys for each page/section
PAGE_API_KEYS = {
    "login": "LOGIN_001",
    "journey": "JOURNEY_002", 
    "quiz": "QUIZ_003",
    "letter": "LETTER_004",
    "comfort": "COMFORT_005",
    "drama": "DRAMA_006",
    "tasks": "TASKS_007",
    "gift": "GIFT_008",
    "final": "FINAL_009"
}

# Define Models
class Interaction(BaseModel):
    type: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    api_key: Optional[str] = None
    page: Optional[str] = None

class QuizAnswer(BaseModel):
    questionId: int
    answer: int
    isCorrect: bool

class Session(BaseModel):
    sessionId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nickname: str
    startTime: datetime = Field(default_factory=datetime.utcnow)
    lastActivity: datetime = Field(default_factory=datetime.utcnow)
    completedSections: List[str] = Field(default_factory=list)
    quizScore: int = 0
    quizAnswers: List[QuizAnswer] = Field(default_factory=list)
    roomsVisited: List[str] = Field(default_factory=list)
    interactions: List[Interaction] = Field(default_factory=list)
    isCompleted: bool = False
    pageVisits: Dict[str, int] = Field(default_factory=dict)
    apiKeyUsage: Dict[str, List[Dict[str, Any]]] = Field(default_factory=dict)

class SessionCreate(BaseModel):
    nickname: str

class ProgressUpdate(BaseModel):
    section: str
    completed: bool
    data: Optional[Dict[str, Any]] = None
    api_key: Optional[str] = None

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]
    score: int
    api_key: Optional[str] = None

class RoomVisit(BaseModel):
    roomId: str
    visitTime: datetime = Field(default_factory=datetime.utcnow)
    api_key: Optional[str] = None

class InteractionCreate(BaseModel):
    type: str
    content: str
    api_key: Optional[str] = None
    page: Optional[str] = None

class ApiKeyUsage(BaseModel):
    api_key: str
    page: str
    action: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: str
    data: Optional[Dict[str, Any]] = None

# Helper function to update last activity
async def update_last_activity(session_id: str):
    if session_id in sessions_db:
        sessions_db[session_id]["lastActivity"] = datetime.utcnow()

# Helper function to track API key usage
async def track_api_key_usage(session_id: str, api_key: str, page: str, action: str, data: Optional[Dict[str, Any]] = None):
    if session_id in sessions_db:
        if "apiKeyUsage" not in sessions_db[session_id]:
            sessions_db[session_id]["apiKeyUsage"] = {}
        
        if api_key not in sessions_db[session_id]["apiKeyUsage"]:
            sessions_db[session_id]["apiKeyUsage"][api_key] = []
        
        usage_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "page": page,
            "action": action,
            "data": data or {}
        }
        
        sessions_db[session_id]["apiKeyUsage"][api_key].append(usage_entry)
        
        # Track page visits
        if "pageVisits" not in sessions_db[session_id]:
            sessions_db[session_id]["pageVisits"] = {}
        
        if page not in sessions_db[session_id]["pageVisits"]:
            sessions_db[session_id]["pageVisits"][page] = 0
        
        sessions_db[session_id]["pageVisits"][page] += 1

# Routes
@api_router.get("/")
async def root():
    return {"message": "Love App Backend - Ready to capture hearts! 💙"}

@api_router.get("/api-keys")
async def get_api_keys():
    """Get all available API keys for tracking"""
    return {
        "api_keys": PAGE_API_KEYS,
        "description": "API keys for tracking page visits and interactions"
    }

@api_router.post("/sessions")
async def create_session(session_data: SessionCreate):
    try:
        # Check if nickname is correct
        if session_data.nickname.lower() != "hummi":
            raise HTTPException(status_code=400, detail="Invalid nickname")
        
        session = Session(nickname=session_data.nickname)
        sessions_db[session.sessionId] = session.dict()
        
        # Track login with API key
        await track_api_key_usage(
            session.sessionId, 
            PAGE_API_KEYS["login"], 
            "login", 
            "session_created",
            {"nickname": session_data.nickname}
        )
        
        return {
            "sessionId": session.sessionId,
            "message": "Welcome, beautiful! Your journey begins now... 💙",
            "api_key": PAGE_API_KEYS["login"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    try:
        session = sessions_db.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        await update_last_activity(session_id)
        return session
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/sessions/{session_id}/progress")
async def update_progress(session_id: str, progress: ProgressUpdate):
    try:
        session = sessions_db.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Add section to completed list if not already there
        completed_sections = session.get("completedSections", [])
        if progress.completed and progress.section not in completed_sections:
            completed_sections.append(progress.section)
        
        update_data = {
            "completedSections": completed_sections,
            "lastActivity": datetime.utcnow()
        }
        
        # Store additional data if provided
        if progress.data:
            update_data[f"{progress.section}_data"] = progress.data
        
        if session_id in sessions_db:
            sessions_db[session_id].update(update_data)
        
        # Track progress with API key
        api_key = progress.api_key or PAGE_API_KEYS.get(progress.section, "UNKNOWN")
        await track_api_key_usage(
            session_id,
            api_key,
            progress.section,
            "progress_updated",
            {"completed": progress.completed, "data": progress.data}
        )
        
        return {
            "success": True,
            "completedSections": completed_sections,
            "api_key": api_key
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/sessions/{session_id}/quiz")
async def submit_quiz(session_id: str, quiz: QuizSubmission):
    try:
        if session_id in sessions_db:
            sessions_db[session_id].update({
                "quizScore": quiz.score,
                "quizAnswers": [answer.dict() for answer in quiz.answers],
                "lastActivity": datetime.utcnow()
            })
        
        # Add interaction for quiz completion
        interaction = {
            "type": "quiz_completed",
            "content": f"Scored {quiz.score}/{len(quiz.answers)}",
            "timestamp": datetime.utcnow(),
            "api_key": quiz.api_key or PAGE_API_KEYS["quiz"]
        }
        
        if session_id in sessions_db:
            if "interactions" not in sessions_db[session_id]:
                sessions_db[session_id]["interactions"] = []
            sessions_db[session_id]["interactions"].append(interaction)
        
        # Track quiz with API key
        await track_api_key_usage(
            session_id,
            quiz.api_key or PAGE_API_KEYS["quiz"],
            "quiz",
            "quiz_submitted",
            {"score": quiz.score, "total_questions": len(quiz.answers)}
        )
        
        return {
            "success": True,
            "finalScore": quiz.score,
            "message": f"Quiz completed with {quiz.score}/{len(quiz.answers)} correct! 💙",
            "api_key": quiz.api_key or PAGE_API_KEYS["quiz"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/sessions/{session_id}/rooms")
async def visit_room(session_id: str, room_visit: RoomVisit):
    try:
        session = sessions_db.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        rooms_visited = session.get("roomsVisited", [])
        if room_visit.roomId not in rooms_visited:
            rooms_visited.append(room_visit.roomId)
        
        if session_id in sessions_db:
            sessions_db[session_id].update({
                "roomsVisited": rooms_visited,
                "lastActivity": datetime.utcnow()
            })
        
        # Add interaction for room visit
        interaction = {
            "type": "room_visit",
            "content": f"Visited {room_visit.roomId} room",
            "timestamp": room_visit.visitTime,
            "api_key": room_visit.api_key or PAGE_API_KEYS["comfort"]
        }
        
        if session_id in sessions_db:
            if "interactions" not in sessions_db[session_id]:
                sessions_db[session_id]["interactions"] = []
            sessions_db[session_id]["interactions"].append(interaction)
        
        # Track room visit with API key
        await track_api_key_usage(
            session_id,
            room_visit.api_key or PAGE_API_KEYS["comfort"],
            "comfort",
            "room_visited",
            {"room_id": room_visit.roomId}
        )
        
        return {
            "success": True,
            "totalVisits": len(rooms_visited),
            "message": f"Thank you for visiting the {room_visit.roomId} room 💙",
            "api_key": room_visit.api_key or PAGE_API_KEYS["comfort"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/sessions/{session_id}/interactions")
async def add_interaction(session_id: str, interaction: InteractionCreate):
    try:
        interaction_data = {
            "type": interaction.type,
            "content": interaction.content,
            "timestamp": datetime.utcnow(),
            "api_key": interaction.api_key,
            "page": interaction.page
        }
        
        if session_id in sessions_db:
            if "interactions" not in sessions_db[session_id]:
                sessions_db[session_id]["interactions"] = []
            sessions_db[session_id]["interactions"].append(interaction_data)
            sessions_db[session_id]["lastActivity"] = datetime.utcnow()
        
        # Track interaction with API key
        if interaction.api_key:
            await track_api_key_usage(
                session_id,
                interaction.api_key,
                interaction.page or "unknown",
                "interaction_added",
                {"type": interaction.type, "content": interaction.content}
            )
        
        return {"success": True, "api_key": interaction.api_key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/sessions/{session_id}/analytics")
async def get_session_analytics(session_id: str):
    """Get detailed analytics for a session including API key usage"""
    try:
        session = sessions_db.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        analytics = {
            "session_id": session_id,
            "nickname": session.get("nickname"),
            "start_time": session.get("startTime"),
            "last_activity": session.get("lastActivity"),
            "completed_sections": session.get("completedSections", []),
            "quiz_score": session.get("quizScore", 0),
            "rooms_visited": session.get("roomsVisited", []),
            "total_interactions": len(session.get("interactions", [])),
            "page_visits": session.get("pageVisits", {}),
            "api_key_usage": session.get("apiKeyUsage", {}),
            "is_completed": session.get("isCompleted", False)
        }
        
        return analytics
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/sessions/{session_id}/final")
async def get_final_message(session_id: str):
    try:
        session = sessions_db.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Calculate journey statistics
        completed_sections = session.get("completedSections", [])
        quiz_score = session.get("quizScore", 0)
        rooms_visited = session.get("roomsVisited", [])
        interactions = session.get("interactions", [])
        start_time = session.get("startTime")
        last_activity = session.get("lastActivity")
        
        # Calculate time spent
        time_spent_minutes = 0
        if start_time and last_activity:
            time_diff = last_activity - start_time
            time_spent_minutes = int(time_diff.total_seconds() / 60)
        
        # Generate achievements
        achievements = []
        if "journey" in completed_sections:
            achievements.append("Memory Keeper - Completed our love journey 💫")
        if "quiz" in completed_sections:
            achievements.append("Heart Reader - Took the quiz about us 💕")
        if "letter" in completed_sections:
            achievements.append("Love Letter Recipient - Read my heartfelt message 💌")
        if "comfort" in completed_sections:
            achievements.append("Safe Space Visitor - Entered comfort rooms 🏠")
        if "drama" in completed_sections:
            achievements.append("Drama Queen - Unlocked drama content 🎭")
        if "tasks" in completed_sections:
            achievements.append("Royal Status - Completed funny tasks 👑")
        
        if len(rooms_visited) == 2:
            achievements.append("Fearless Explorer - Visited all comfort rooms 🦸‍♀️")
        if quiz_score >= 4:
            achievements.append("Perfect Match - High quiz score 💯")
        if len(interactions) > 10:
            achievements.append("Active Participant - Engaged with many features ⭐")
        
        # Generate personalized final message
        final_message = f"""
        Dearest Hummi,
        
        What an incredible journey we just shared! 💙
        
        You spent {time_spent_minutes} beautiful minutes with me, exploring our story, 
        discovering comfort in my virtual arms, and letting me show you just how much you mean to me.
        
        Here's what made this journey special:
        • You completed {len(completed_sections)} sections of our love story
        • You scored {quiz_score}/5 on knowing me (but you're perfect regardless!)
        • You visited {len(rooms_visited)} comfort rooms where I promised to protect you
        • You engaged with {len(interactions)} different moments I created just for you
        
        Humera, this web application is more than just code and pretty colors. 
        It's my heart, digitized and presented to you with all the love I have.
        
        Every click you made, every section you completed, every moment you spent here - 
        it all means the world to me because YOU were experiencing it.
        
        I want to be your support system, your comfort during thunderstorms, 
        your ghost defender, your real-life drama hero, and most importantly - 
        the person who makes you smile the way you make me smile every single day.
        
        Thank you for being the wonderful, soft-hearted, amazing person you are.
        Thank you for giving me hope that our story is just beginning.
        
        This isn't goodbye, Hummi. This is "until we create more beautiful moments together."
        
        With all my love and endless conversations ahead,
        Your devoted admirer who thinks you're absolutely amazing ✨
        
        P.S. - Every time you miss me, just revisit this app. I'll be here, waiting to comfort you,
        make you laugh, and remind you how incredibly special you are. 💙
        """
        
        # Mark session as completed
        if session_id in sessions_db:
            sessions_db[session_id].update({
                "isCompleted": True,
                "lastActivity": datetime.utcnow()
            })
        
        # Track final page with API key
        await track_api_key_usage(
            session_id,
            PAGE_API_KEYS["final"],
            "final",
            "final_message_viewed",
            {"time_spent_minutes": time_spent_minutes, "achievements_count": len(achievements)}
        )
        
        return {
            "message": final_message,
            "stats": {
                "timeSpent": f"{time_spent_minutes} minutes",
                "sectionsCompleted": len(completed_sections),
                "quizScore": f"{quiz_score}/5",
                "roomsVisited": len(rooms_visited),
                "totalInteractions": len(interactions)
            },
            "achievements": achievements,
            "api_key": PAGE_API_KEYS["final"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Legacy routes for compatibility
@api_router.post("/status")
async def create_status_check():
    return {"message": "Love App Backend is running! 💙"}

@api_router.get("/status")
async def get_status_checks():
    return [{"message": "Love App Backend - All systems go! 💙"}]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# No shutdown needed for in-memory storage

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
