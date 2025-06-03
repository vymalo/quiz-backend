# Quizz Backend

A NestJS-based backend service for generating quiz questions and evaluating responses using AI models.

## Overview

Quizz Backend is a powerful API service that leverages AI to:
- Generate customized quiz questions on any topic
- Evaluate responses to questions, providing both good and bad example answers
- Deliver results through a clean, well-documented REST API

The service uses OpenAI models to generate high-quality questions and responses, making it suitable for educational applications, learning platforms, or any system requiring dynamic quiz generation.

## Features

- **AI-Powered Question Generation**: Create questions on any topic with customizable difficulty
- **Response Evaluation**: Submit responses and get evaluations of their correctness
- **OpenAPI Documentation**: Comprehensive API documentation with Swagger UI
- **Containerized Deployment**: Easy deployment with Docker
- **Environment Configuration**: Flexible configuration through environment variables

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **AI Integration**: OpenAI API via AI SDK
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## API Endpoints

### Questions

- `POST /questions`: Create a new set of questions based on a provided topic and difficulty

### Responses

- `POST /responses`: Submit a response for a given question and evaluate its correctness

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager
- OpenAI API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# OpenAI Configuration for Question Generation
OPENAI_QUESTION_API_KEY=your_openai_api_key
OPENAI_QUESTION_BASE_URL=https://api.openai.com/v1
OPENAI_QUESTION_MODEL=gpt-4

# OpenAI Configuration for Response Evaluation
OPENAI_RESPONSE_API_KEY=your_openai_api_key
OPENAI_RESPONSE_BASE_URL=https://api.openai.com/v1
OPENAI_RESPONSE_MODEL=gpt-4

# Server Configuration
PORT=3000
```

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start:dev

# Build for production
yarn build

# Start production server
yarn start:prod
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t quiz-backend .

# Run the container
docker run -p 3000:3000 --env-file ./.env quiz-backend
```

## API Documentation

Once the server is running, you can access the Swagger UI documentation at:

- http://localhost:3000/api

The OpenAPI specification is available at:

- http://localhost:3000/api-json

## Development

### Available Scripts

- `yarn build`: Build the application
- `yarn format`: Format code using Prettier
- `yarn start`: Start the application
- `yarn start:dev`: Start the application in watch mode
- `yarn start:debug`: Start the application in debug mode
- `yarn start:prod`: Start the production build
- `yarn lint`: Lint the code
- `yarn test`: Run tests
- `yarn test:watch`: Run tests in watch mode
- `yarn test:cov`: Run tests with coverage
- `yarn test:debug`: Debug tests
- `yarn test:e2e`: Run end-to-end tests

## Important Notes

- The API endpoints utilize AI models and may take some time to respond
- The responses from the AI models are not deterministic
- It is recommended to save generated content if you need to refer to it later

## License

This project is licensed under the UNLICENSED license.