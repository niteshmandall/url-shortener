# URL Shortener API

A scalable URL shortener service with advanced analytics and Google Sign-In authentication.

## Features

- URL shortening with custom aliases
- Comprehensive analytics
- Google Sign-In authentication
- Rate limiting
- Redis caching
- Docker support

## API Documentation

### Authentication

All endpoints except URL redirection require Google Sign-In authentication. Include the Google ID token in the Authorization header:

```
Authorization: Bearer <google-id-token>
```

### Endpoints

#### 1. Create Short URL
- **POST** `/api/shorten`
- **Body:**
  ```json
  {
    "longUrl": "https://example.com",
    "customAlias": "custom123",
    "topic": "acquisition"
  }
  ```
- **Response:** 
  ```json
  {
    "shortUrl": "http://localhost:3000/abc123",
    "createdAt": "2024-01-20T12:00:00Z"
  }
  ```

#### 2. Get URL Analytics
- **GET** `/api/analytics/url/:alias`
- **Response:**
  ```json
  {
    "totalClicks": 100,
    "uniqueClicks": 75,
    "clicksByDate": [
      {
        "date": "2024-01-20",
        "count": 25
      }
    ],
    "osType": [
      {
        "osName": "Windows",
        "uniqueClicks": 50,
        "uniqueUsers": 40
      }
    ],
    "deviceType": [
      {
        "deviceName": "desktop",
        "uniqueClicks": 60,
        "uniqueUsers": 45
      }
    ]
  }
  ```

#### 3. Get Topic Analytics
- **GET** `/api/analytics/topic/:topic`
- **Response:**
  ```json
  {
    "totalClicks": 500,
    "uniqueClicks": 300,
    "clicksByDate": [
      {
        "date": "2024-01-20",
        "count": 100
      }
    ],
    "urls": [
      {
        "shortUrl": "http://localhost:3000/abc123",
        "totalClicks": 250,
        "uniqueClicks": 180
      }
    ]
  }
  ```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/url.test.js
```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access Swagger documentation at:
   ```
   http://localhost:3000/api-docs
   ```

## Docker Deployment

```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

## How to Generate the ID Token (Bearer Token) for Secured Endpoints

Follow the instructions in the reference video below to generate the ID token for authentication:

[Reference Video Link](https://www.youtube.com/watch?v=zHfR96IZECQ&t=421s)
