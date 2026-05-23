import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

// API Keys for each page/section
const PAGE_API_KEYS = {
  login: "LOGIN_001",
  journey: "JOURNEY_002", 
  quiz: "QUIZ_003",
  letter: "LETTER_004",
  comfort: "COMFORT_005",
  drama: "DRAMA_006",
  tasks: "TASKS_007",
  gift: "GIFT_008",
  final: "FINAL_009"
};

class LoveAppService {
  constructor() {
    this.sessionId = localStorage.getItem('loveapp_session_id') || null;
  }

  // Session Management
  async createSession(nickname) {
    try {
      const response = await axios.post(`${API}/sessions`, { nickname });
      this.sessionId = response.data.sessionId;
      localStorage.setItem('loveapp_session_id', this.sessionId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create session');
    }
  }

  async getSession() {
    if (!this.sessionId) return null;
    
    try {
      const response = await axios.get(`${API}/sessions/${this.sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  // Progress Tracking
  async updateProgress(section, completed = true, data = null) {
    if (!this.sessionId) return { success: false };

    try {
      const response = await axios.put(`${API}/sessions/${this.sessionId}/progress`, {
        section,
        completed,
        data,
        api_key: PAGE_API_KEYS[section] || "UNKNOWN"
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update progress:', error);
      return { success: false };
    }
  }

  // Quiz Management
  async submitQuiz(answers, score) {
    if (!this.sessionId) return { success: false };

    try {
      const response = await axios.post(`${API}/sessions/${this.sessionId}/quiz`, {
        answers,
        score,
        api_key: PAGE_API_KEYS.quiz
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      return { success: false };
    }
  }

  // Room Visits
  async visitRoom(roomId) {
    if (!this.sessionId) return { success: false };

    try {
      const response = await axios.post(`${API}/sessions/${this.sessionId}/rooms`, {
        roomId,
        visitTime: new Date(),
        api_key: PAGE_API_KEYS.comfort
      });
      return response.data;
    } catch (error) {
      console.error('Failed to record room visit:', error);
      return { success: false };
    }
  }

  // Interactions
  async addInteraction(type, content, page = null) {
    if (!this.sessionId) return { success: false };

    try {
      const response = await axios.post(`${API}/sessions/${this.sessionId}/interactions`, {
        type,
        content,
        api_key: page ? PAGE_API_KEYS[page] : null,
        page: page
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add interaction:', error);
      return { success: false };
    }
  }

  // Final Message
  async getFinalMessage() {
    if (!this.sessionId) return null;

    try {
      const response = await axios.get(`${API}/sessions/${this.sessionId}/final`);
      return response.data;
    } catch (error) {
      console.error('Failed to get final message:', error);
      return null;
    }
  }

  // Analytics
  async getSessionAnalytics() {
    if (!this.sessionId) return null;

    try {
      const response = await axios.get(`${API}/sessions/${this.sessionId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session analytics:', error);
      return null;
    }
  }

  // Get API Keys
  getApiKeys() {
    return PAGE_API_KEYS;
  }

  // Utility Methods
  getSessionId() {
    return this.sessionId;
  }

  hasSession() {
    return !!this.sessionId;
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('loveapp_session_id');
  }
}

// Create and export singleton instance
const loveAppService = new LoveAppService();
export default loveAppService;