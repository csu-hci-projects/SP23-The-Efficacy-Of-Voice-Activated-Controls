FROM python:3.8.8-buster

COPY ./api/ ./api
WORKDIR /api
RUN pip install --upgrade pip
RUN pip install fastapi pydantic python-dotenv python-multipart uvicorn watchdog[watchmedo]
RUN chmod u+x voice_control_api.py

ENTRYPOINT [ "python", "voice_control_api.py" ]

EXPOSE 8080