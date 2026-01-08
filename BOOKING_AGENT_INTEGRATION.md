# Booking Agent Integration

## What's New

Your Sick Day with Ferris website now has an AI-powered booking assistant!

### Features Added

1. **Booking Chat Widget** (Front-end)
   - Appears as a floating chat button on your website
   - Venues can inquire about booking the band
   - Collects contact info before starting conversation
   - Sends messages to the AI agent for intelligent responses

2. **Admin Bookings Tab** (Admin Panel)
   - New "Bookings" tab in admin dashboard
   - View all booking inquiries from venues
   - Read conversation history
   - Mark conversations as resolved or archived
   - Quick actions to email venues or create bookings

## How It Works

1. **Venue visits website** → Clicks chat button → Enters contact info → Asks about booking
2. **AI Agent responds** → Enforces $1,500/3hr rate + $300 PA fee → Professional, friendly tone
3. **Conversation saved** → All messages stored in Supabase database
4. **Admin reviews** → View conversations in admin panel → Take action

## Setup Required

### 1. Start the Agent API Server

The chat widget needs the Python agent API to be running:

```bash
cd C:\Users\jah00\projects\booking-agent\agent
python api.py  # You'll need to create this FastAPI server
```

### 2. Environment Variables

Make sure your `.env.local` has the Supabase credentials (already set):
```
VITE_SUPABASE_URL=https://lgixrffpqfdqxberhcut.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iv3G_KgvNgFNqWq50S0Jhw_R2r6DhKJ
```

### 3. Run the Website

```bash
cd C:\Users\jah00\projects\SickDay
npm run dev
```

Visit: http://localhost:5173

## Testing

1. **Front-end Chat:**
   - Look for the pink chat bubble in the bottom right
   - Click it and enter your info
   - Ask: "We'd like to book you for March 15th. What's your rate?"
   - Agent should respond with $1,500 rate info

2. **Admin Panel:**
   - Go to http://localhost:5173/admin/login
   - Login with your credentials
   - Click "Bookings" tab
   - View conversations from the chat

## Next Steps

### Create the API Server (Required for chat to work)

Create `C:\Users\jah00\projects\booking-agent\agent\api.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from app.agent.orchestrator import booking_agent

load_dotenv()

app = FastAPI()

# Allow requests from your website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    sender_name: str
    sender_email: str
    sender_type: str = "venue"
    venue_name: str | None = None

@app.post("/api/chat")
async def chat(request: ChatRequest):
    result = await booking_agent.process_message(
        message_content=request.message,
        sender_email=request.sender_email,
        sender_name=request.sender_name,
        sender_type=request.sender_type,
        conversation_id=request.conversation_id
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Then install FastAPI:
```bash
pip install fastapi uvicorn
```

Run it:
```bash
python api.py
```

## Files Modified

- `src/App.jsx` - Added BookingChat component
- `src/components/BookingChat.jsx` - NEW: Chat widget UI
- `src/components/Admin.jsx` - Added "Bookings" tab
- `src/components/AdminBookings.jsx` - NEW: View booking conversations

## Database Tables Used

The agent uses these Supabase tables (already created):
- `conversations` - Stores chat conversations
- `messages` - Stores individual chat messages
- `booking_constraints` - Agent pricing rules ($1,500 + $300 PA)

## Customization

### Change Chat Colors
Edit `src/components/BookingChat.jsx`:
- Line 133: `from-primary to-secondary` (chat button gradient)
- Line 162: `from-primary to-secondary` (header gradient)

### Change Agent Behavior
The agent's personality and rules are in:
- `C:\Users\jah00\projects\booking-agent\agent\app\agent\prompts.py`

### Change Pricing
Update in Supabase → booking_constraints table (already set to $1,500)
