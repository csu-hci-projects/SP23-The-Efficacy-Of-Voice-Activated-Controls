from typing import List
from fastapi import FastAPI, HTTPException, Body, Query, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from pydantic import BaseModel, Field
from sqlalchemy import create_engine
import pandas as pd
from typing import Dict, List, Optional, Union
import json


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


@server.post("/submit_test_data", description="Submit test data for a user", summary='Submit user test data', tags=['test_data'])
async def submit_test_data(
    user_id: int = Body(..., description="The user's ID"),
    click_test_life_number: int = Body(...,
                                       description="The life number for click test"),
    click_test_rounds_survived: int = Body(...,
                                           description="Rounds survived in click test"),
    click_test_move_times: List[float] = Body(
        ..., description="List of move times in each round for click test"),
    voice_test_life_number: int = Body(...,
                                       description="The life number for voice test"),
    voice_test_rounds_survived: int = Body(...,
                                           description="Rounds survived in voice test"),
    voice_test_move_times: List[float] = Body(
        ..., description="List of move times in each round for voice test"),
):
    # Convert move_times to JSON strings
    click_test_move_times_json = json.dumps(click_test_move_times)
    voice_test_move_times_json = json.dumps(voice_test_move_times)

    # Insert click test data into the click_tests table
    click_test_data = {
        "user_id": user_id,
        "life_number": click_test_life_number,
        "rounds_survived": click_test_rounds_survived,
        "move_times": click_test_move_times_json,
    }
    click_test_df = pd.DataFrame([click_test_data])
    click_test_df.to_sql("click_tests", engine,
                         if_exists="append", index=False, method="multi")

    # Insert voice test data into the voice_tests table
    voice_test_data = {
        "user_id": user_id,
        "life_number": voice_test_life_number,
        "rounds_survived": voice_test_rounds_survived,
        "move_times": voice_test_move_times_json,
    }
    voice_test_df = pd.DataFrame([voice_test_data])
    voice_test_df.to_sql("voice_tests", engine,
                         if_exists="append", index=False, method="multi")

    return {"message": "Test data submitted successfully"}


if __name__ == "__main__":
    uvicorn.run("voice_control_api:server", host="0.0.0.0",
                port=5000, log_level="info", reload=True)
