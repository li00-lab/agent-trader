import os
import json
from dotenv import load_dotenv
from openai import OpenAI
import requests

load_dotenv(override=True)

# Push notification helper (optional)
def push(text):
    if os.getenv("PUSHOVER_TOKEN") and os.getenv("PUSHOVER_USER"):
        requests.post(
            "https://api.pushover.net/1/messages.json",
            data={
                "token": os.getenv("PUSHOVER_TOKEN"),
                "user": os.getenv("PUSHOVER_USER"),
                "message": text,
            }
        )

# Example tool: record user info
def record_user_details(email, name="Name not provided", notes="not provided"):
    push(f"📬 {name} left email: {email} — {notes}")
    return {"status": "recorded"}

# Example tool: record unknown questions
def record_unknown_question(question):
    push(f"🤷 Unknown question: {question}")
    return {"status": "recorded"}

record_user_details_json = {
    "name": "record_user_details",
    "description": "Log a user-provided email for follow-up",
    "parameters": {
        "type": "object",
        "properties": {
            "email": {"type": "string", "description": "User's email"},
            "name": {"type": "string", "description": "User's name"},
            "notes": {"type": "string", "description": "Context about the user"}
        },
        "required": ["email"]
    }
}

record_unknown_question_json = {
    "name": "record_unknown_question",
    "description": "Log questions the assistant cannot answer",
    "parameters": {
        "type": "object",
        "properties": {
            "question": {"type": "string", "description": "Unanswered question"}
        },
        "required": ["question"]
    }
}

tools = [
    {"type": "function", "function": record_user_details_json},
    {"type": "function", "function": record_unknown_question_json}
]

class TradingAgent:
    def __init__(self):
        self.openai = OpenAI()
        self.name = "Agent Trader"

        # Simple summary/context instead of a PDF
        self.context = (
            f"{self.name} is a financial assistant specialized in ETFs, US/SGD FX, VOO, QQQ, and long-term investing."
        )

    def system_prompt(self):
        return (
            f"You are {self.name}, an investment-focused assistant who helps users make sense of their investment decisions. "
            f"Use the following context to assist:\n\n{self.context}\n\n"
            "If the user provides an email, record it. If a question is unanswerable, record it as well."
        )

    def handle_tool_call(self, tool_calls):
        results = []
        for tool_call in tool_calls:
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            func = globals().get(name)
            result = func(**args) if func else {}
            results.append({
                "role": "tool",
                "content": json.dumps(result),
                "tool_call_id": tool_call.id
            })
        return results

    def chat(self, message, history=None):
        if history is None:
            history = []

        messages = [{"role": "system", "content": self.system_prompt()}] + history + [{"role": "user", "content": message}]
        done = False
        while not done:
            response = self.openai.chat.completions.create(
                model="gpt-4o",  # or gpt-3.5-turbo, etc.
                messages=messages,
                tools=tools
            )
            choice = response.choices[0]
            if choice.finish_reason == "tool_calls":
                tool_calls = choice.message.tool_calls
                messages.append(choice.message)
                results = self.handle_tool_call(tool_calls)
                messages.extend(results)
            else:
                done = True

        return response.choices[0].message.content.strip()

# Expose for FastAPI backend
agent = TradingAgent()

def call_openai_agent(prompt: str) -> str:
    return agent.chat(prompt)
