from typing import Any, List

import numpy as np
from fastapi import FastAPI, HTTPException, Body, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

import uvicorn
import logging
from pydantic import BaseModel, Field
from sqlalchemy import create_engine
import pandas as pd
from typing import Dict, List, Optional, Union
import json
import plotly.express as px
import plotly.graph_objs as go
from plotly.subplots import make_subplots
from statsmodels.formula.api import ols
import statsmodels.api as sm


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


def fetch_data_from_database():
    sql = """WITH click_data AS (
                SELECT user_id, life_number, rounds_survived, move_times
                FROM click_tests
                ),
            voice_data AS (
            SELECT user_id, life_number, rounds_survived, move_times
        FROM voice_tests
    )
    SELECT COALESCE(click_data.user_id, voice_data.user_id) AS user_id,
        click_data.life_number AS click_life, click_data.rounds_survived AS click_rounds, click_data.move_times AS click_times,
        voice_data.life_number AS voice_life, voice_data.rounds_survived AS voice_rounds, voice_data.move_times AS voice_times
    FROM click_data
    FULL OUTER JOIN voice_data ON click_data.user_id = voice_data.user_id AND click_data.life_number = voice_data.life_number
    ORDER BY user_id, COALESCE(click_data.life_number, voice_data.life_number);
    """

    df = pd.read_sql(sql, engine)

    df_long = pd.melt(df, id_vars=["user_id", "click_life", "voice_life"], value_vars=[
        "click_times", "voice_times"], var_name="Test", value_name="Times")

    df_long["Test"] = df_long["Test"].map(
        {"click_times": "Click", "voice_times": "Voice"})

    df_long = df_long[df_long["Times"].apply(lambda x: len(x) > 0)]

    df_long["Score"] = df_long["Times"].apply(lambda x: sum(x) / len(x))

    df_long['life_number'] = df_long.apply(
        lambda row: row['click_life'] if row['Test'] == 'Click' else row['voice_life'], axis=1)

    result = df_long[['user_id', 'life_number', 'Test', 'Score']]

    return result


def perform_anova(df_long):
    anova_model = ols('Score ~ Test * user_id', data=df_long).fit()
    anova_result = sm.stats.anova_lm(anova_model, typ=2)
    return anova_result


def create_visualizations(df_long):
    plot_height = 400
    plot_width = 600

    # Box plot
    fig_box = px.box(df_long, x='Test', y='Score',
                     title='Box Plot: Scores by Test', points='all')
    fig_box.update_layout(height=plot_height, width=plot_width)
    fig_box_html = fig_box.to_html(full_html=False)

    # Bar plot
    fig_bar = px.bar(df_long, x='user_id', y='Score', title='Bar Plot: Scores by User and Test',
                     color='Test', barmode='group')
    fig_bar.update_xaxes(tickmode='linear', dtick=1)
    fig_bar.update_layout(height=plot_height, width=plot_width)
    fig_bar_html = fig_bar.to_html(full_html=False)

    # Violin plot
    fig_violin = px.violin(df_long, x='Test', y='Score',
                           title='Violin Plot: Score Distributions by Test', box=True, points='all')
    fig_violin.update_layout(height=plot_height, width=plot_width)
    fig_violin_html = fig_violin.to_html(full_html=False)

    # Scatter plot
    fig_scatter = px.scatter(df_long, x='user_id', y='Score',
                             title='Scatter Plot: Scores by User and Test', color='Test', symbol='Test')
    fig_scatter.update_xaxes(tickmode='linear', dtick=1)
    fig_scatter.update_layout(height=plot_height, width=plot_width)
    fig_scatter_html = fig_scatter.to_html(full_html=False)

    # Line plot
    fig_line = px.line(df_long, x='life_number', y='Score', title='Line Plot: Scores by Life Number and Test',
                       color='Test', facet_col='user_id', line_dash='Test', markers=True)
    fig_line.update_layout(height=plot_height, width=plot_width * 2)
    fig_line_html = fig_line.to_html(full_html=False)

    return fig_box_html, fig_bar_html, fig_violin_html, fig_scatter_html, fig_line_html


@server.get("/anova", response_class=HTMLResponse)
async def anova():
    try:
        df_long = fetch_data_from_database()
        anova_result = perform_anova(df_long)
        fig_box_html, fig_bar_html, fig_violin_html, fig_scatter_html, fig_line_html = create_visualizations(
            df_long)

        response = f"<h2>ANOVA Results:</h2><pre>{anova_result.to_string()}</pre><h2>Visualizations:</h2><h3>Box Plot:</h3>{fig_box_html}<h3>Bar Plot:</h3>{fig_bar_html}<h3>Violin Plot:</h3>{fig_violin_html}<h3>Scatter Plot:</h3>{fig_scatter_html}<h3>Line Plot:</h3>{fig_line_html}"
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
