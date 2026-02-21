from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import audit  # We will create this next

app = FastAPI(title="FounderLens API", version="1.0.2")

# Allow your Next.js frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "region": "Bengaluru-IN"}

# Include our audit logic
app.include_router(audit.router, prefix="/api/v1")