# 🛡️ Chat-Social-Interaction-Gatekeeper

**AI Gatekeeper** is a robust, real-time chat moderation system designed to protect communities from malicious content using advanced AI. Powered by **Google Gemini 2.5 Flash**, it automatically detects and flags phishing, scams, toxicity, harassment, and hate speech in real-time, ensuring a safe digital environment.

## 🚀 Features

*   **Real-Time Message Analysis**: Utilizing **Google Gemini AI**, messages are analyzed instantly to determine their safety.
*   **Intelligent Classification**: Detects various types of malicious intent, including:
    *   Phishing attempts
    *   Scams and fraud
    *   Toxicity and aggression
    *   Harassment
    *   Hate speech
*   **Batch Processing**: Efficiently groups messages for AI analysis to optimize performance and reduce API calls.
*   **Automated Enforcement**: Automatically updates message status (`SAFE` or `MALICIOUS`) and logs incidents for review.
*   **Incident Logging**: Detailed tracking of malicious activity linked to specific users and messages.
*   **Real-Time Communication**: Built on **WebSockets (Socket.io)** for low-latency chat experiences.
*   **Secure Authentication**: robust JWT-based authentication via **Passport.js**.
*   **Scalable Architecture**: Modular NestJS structure with PostgreSQL and TypeORM.
*   **Swagger API Docs**: Auto-generated API documentation for easy integration.

## 🛠️ Tech Stack

*   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
*   **Language**: TypeScript
*   **Database**: PostgreSQL
*   **ORM**: TypeORM
*   **AI Model**: Google Gemini 1.5/2.5 Flash
*   **Real-Time**: Socket.io
*   **Authentication**: Passport.js & JWT
*   **Documentation**: Swagger (OpenAPI)

## 📂 Project Structure

```
src/
├── ai/                 # AI Service (Google Gemini integration)
├── auth/               # Authentication (JWT, Guards)
├── batch/              # Message batching logic for AI optimization
├── common/             # Shared utilities, filters, and guards
├── enforcement/        # Logic for applying AI verdicts (Ban/Flag)
├── malicious-activity/ # Incident logging and entities
├── messages/           # Message management and storage
├── websocket/          # Gateway for real-time chat
├── main.ts             # Application entry point
└── app.module.ts       # Root module
```

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

*   **Node.js** (v18+)
*   **npm** or **yarn**
*   **PostgreSQL** (running locally or via Docker)

## ⚙️ Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/ai-gatekeeper.git
    cd ai-gatekeeper
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and configure the following variables:
    ```env
    # App
    PORT=3000
    
    # Database
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USERNAME=postgres
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=ai_gatekeeper
    
    # JWT
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=1h
    
    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Database Migration**:
    ```bash
    # Run migrations to setup tables
    npm run migration:run
    ```

## ▶️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or your configured port).

## 📖 API Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

This provides an interactive interface to test REST endpoints for Authentication, Users, and other resources.

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
