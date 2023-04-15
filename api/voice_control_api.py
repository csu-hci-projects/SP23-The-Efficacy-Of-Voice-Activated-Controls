from fastapi import FastAPI, HTTPException, Body, Query, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from pydantic import BaseModel, Field
from sqlalchemy import create_engine
import pandas as pd
from typing import Dict, List, Optional, Union


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

# Replace the following values with your actual database credentials
DB_USER = "postgres"
DB_PASSWORD = "123"
DB_HOST = "voice_control_db"
DB_PORT = "5432"
DB_NAME = "postgres"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)


class User(BaseModel):
    first_name: str = Field(..., description="The user's first name")
    last_name: str = Field(..., description="The user's last name")


@server.get("/")
def read_root():
    return {"hello": "world"}


@server.post("/add_user", description="Add a user if they don't exist in the database", summary='Registers new users', tags=['login'])
async def add_user(
    first_name: Optional[str] = Query(
        default='', description='Users first name'),
    last_name: Optional[str] = Query(
        default='', description='Users last name'),
):

    if not first_name or not last_name:
        raise HTTPException(
            status_code=400, detail="First name and last name must be provided")

    # Check if user already exists in the database
    query = "SELECT * FROM users WHERE first_name = %s AND last_name = %s;"
    existing_users = pd.read_sql_query(
        query, engine, params=(first_name, last_name))

    if not existing_users.empty:
        raise HTTPException(status_code=400, detail="User already exists")

    # Insert user if they don't exist
    user_data = {"first_name": [first_name], "last_name": [last_name]}
    new_user_df = pd.DataFrame(user_data)
    new_user_df.to_sql("users", engine, if_exists="append",
                       index=False, method="multi")

    # Get the user's ID
    query = "SELECT id FROM users WHERE first_name = %s AND last_name = %s;"
    user_id = pd.read_sql_query(query, engine, params=(
        first_name, last_name)).iloc[0]["id"]

    return {"id": int(user_id), "first_name": first_name, "last_name": last_name}


if __name__ == "__main__":
    uvicorn.run("voice_control_api:server", host="0.0.0.0",
                port=5000, log_level="info", reload=True)
