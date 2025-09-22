# Brain Box Password Server

Server for storing and retrieving game scores using Express and Redis.

## Features

- Store player scores with name, time, and date
- Retrieve leaderboard rankings
- Get player rank based on completion time
- CORS enabled for web frontend
- Redis for high-performance score storage

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your Redis configuration:
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
PORT=3000
```

4. Start Redis server (if using local Redis):
```bash
redis-server
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/scores
Save a new score

Request body:
```json
{
  "name": "Player Name",
  "time": 120,
  "date": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/scores
Get leaderboard scores

Query parameters:
- `limit` (optional): Number of scores to return (default: 50)

Response:
```json
{
  "scores": [
    {
      "name": "Player Name",
      "time": 120,
      "date": "2024-01-15T10:30:00.000Z",
      "timestamp": 1705308600000
    }
  ],
  "total": 1
}
```

### GET /api/scores/rank/:time
Get player rank based on completion time

Response:
```json
{
  "rank": 5,
  "time": 120
}
```

### GET /health
Health check endpoint

## Redis Data Structure

Scores are stored in a Redis sorted set with the key `game:scores`:
- Score value: Time in seconds (lower is better)
- Member: JSON string containing score details