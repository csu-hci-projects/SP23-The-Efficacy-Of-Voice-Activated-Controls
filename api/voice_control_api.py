from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

server = FastAPI(
    title='Voice Control API',
    description='Provide data to the Voice Control App'
)

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@server.get("/")
def read_root():
    return {"hello": "world"}


if __name__ == "__main__":
    uvicorn.run("voice_control_api:server", host="0.0.0.0",
                port=5000, log_level="info", reload=True)
