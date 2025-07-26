from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agent.core import call_openai_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from agent.core import call_openai_agent

@app.post("/query")
async def query_agent(request: Request):
    data = await request.json()
    user_input = data.get("message", "")
    result = call_openai_agent(user_input)
    return {"response": result}