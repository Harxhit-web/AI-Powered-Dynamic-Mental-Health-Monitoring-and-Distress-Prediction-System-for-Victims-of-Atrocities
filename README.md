# AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System

An **AI-powered mental health monitoring and distress prediction platform** designed to support victims of atrocities by continuously analyzing their emotional state, identifying changes in psychological distress, and enabling timely intervention from professional counsellors.

The system combines **Artificial Intelligence, Natural Language Processing (NLP), sentiment analysis, distress prediction, conversational AI, database management, and emergency communication** into a unified platform.

## 🎯 Problem Statement

Victims of atrocities may experience rapidly changing levels of psychological distress, anxiety, fear, hopelessness, trauma, and emotional instability. Traditional mental-health assessment often relies on occasional manual assessments, which may fail to identify sudden changes in a person's condition.

This project aims to provide a **dynamic and continuous monitoring mechanism** that can identify distress signals during interactions and help counsellors intervene when necessary.

## 💡 Proposed Solution

The platform allows users to interact with an AI-powered chatbot. During conversations, the system analyzes the user's messages to determine:

* 🧠 Emotional and psychological distress
* 💬 Sentiment and emotional polarity
* 📈 Changes in distress levels over time
* 🚨 Potential high-risk situations
* 📊 Mental-health trends and behavioural patterns

The analyzed information is securely stored in the database and can be accessed by authorized counsellors and administrators through dedicated dashboards.

When required, users can also request a **counselling call through an IVR-based communication system**, allowing the platform to connect the victim with an available counsellor.

## 🏗️ System Architecture

The project consists of multiple interconnected components:

### 1. 👤 Victim/User Portal

Users can:

* Register and securely log in
* Interact with the AI chatbot
* Receive conversational mental-health support
* Request counselling assistance
* Initiate an emergency/counselling call
* View relevant information and support resources

### 2. 🤖 AI Chatbot

The chatbot acts as the primary interaction layer between the user and the system.

It processes conversations and provides supportive responses while simultaneously passing relevant conversational data to the AI analysis pipeline.

The chatbot can be integrated with NLP/LLM-based systems depending on the deployment requirements.

### 3. 🧠 Distress & Sentiment Detection

The system analyzes chatbot conversations using NLP models to estimate the user's emotional state.

Potential models include transformer-based architectures such as:

* **RoBERTa**
* **Mental-RoBERTa / mental-health fine-tuned transformer models**
* Other domain-specific sentiment and emotion classification models

The pipeline can extract:

**User Message → Sentiment → Emotion → Distress Indicators → Distress Score → Risk Level**

The system can maintain a historical record of these predictions to identify whether a user's condition is:

* Stable
* Improving
* Deteriorating
* Potentially high-risk

### 4. 📊 Dynamic Mental Health Monitoring

Instead of relying on a single assessment, the platform maintains a **time-series view of the user's mental-health indicators**.

For example:

```text
Conversation 1 → Distress: Low
Conversation 2 → Distress: Moderate
Conversation 3 → Distress: High
Conversation 4 → Distress: Critical
```

This enables counsellors to understand the user's changing psychological state rather than looking at an isolated assessment.

### 5. 👨‍⚕️ Counsellor Portal

Authorized counsellors can:

* View assigned users
* Monitor distress levels
* Review relevant conversation insights
* Track mental-health trends
* Identify high-risk users
* Manage counselling sessions
* Contact users when intervention is required

The counsellor dashboard provides a centralized view of users who may require attention.

### 6. 🛡️ Admin Portal

Administrators can manage the overall system, including:

* User management
* Counsellor management
* User-counsellor assignments
* Monitoring system activity
* Managing platform data
* Viewing system-level analytics
* Managing access and roles

### 7. 📞 IVR Counselling & Emergency Communication

The platform also includes an **IVR-based counselling connection mechanism**.

The intended workflow is:

```text
Victim
   ↓
Requests Call
   ↓
Backend retrieves victim's phone number
   ↓
Backend identifies counsellor's phone number
   ↓
IVR initiates/bridges the communication
   ↓
Victim confirms through the required keypad input
   ↓
Victim ↔ Counsellor
```

This provides an additional communication channel when a user requires direct human intervention.

## 🗄️ Database Layer

The system uses a backend database to store application and monitoring information.

Potential data includes:

* User profiles
* Authentication information
* Contact details
* Counsellor profiles
* User-counsellor assignments
* Chat sessions
* Chat messages
* Sentiment results
* Emotion classifications
* Distress scores
* Risk levels
* Counselling requests
* Call/IVR information
* Assessment history

The database enables longitudinal monitoring and allows authorized personnel to access relevant information.

## ⚙️ Backend

The backend is developed using **Python and FastAPI**.

Responsibilities include:

* REST API development
* Authentication and authorization
* Database communication
* User management
* Chat processing
* AI model integration
* Distress prediction
* Sentiment analysis
* Counsellor management
* IVR/call integration
* Data validation
* CORS configuration

Example architecture:

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
FastAPI Backend
      │
      ├── Authentication
      ├── User APIs
      ├── Chat APIs
      ├── AI/NLP Pipeline
      ├── Counsellor APIs
      ├── IVR Service
      │
      ▼
PostgreSQL Database
```

## 💻 Frontend

The frontend is developed using **React.js**.

It provides separate interfaces for different types of users, including:

```text
                 ┌─────────────────┐
                 │   React Frontend │
                 └────────┬────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     Victim Portal   Counsellor Portal   Admin Portal
```

The frontend communicates with the FastAPI backend through HTTP APIs. **Axios** can be used as the HTTP client for communication between React and FastAPI.

## 🔐 Security & Privacy

Because the platform deals with sensitive mental-health and personal information, security and privacy are important components of the system.

The architecture is designed to support:

* Role-based access control
* Secure authentication
* Protected API endpoints
* Database access control
* Secure handling of personal information
* Restricted counsellor/admin access
* Secure communication
* Appropriate logging and auditing

## 🔄 End-to-End Workflow

```text
                    USER
                     │
                     ▼
              React User Portal
                     │
                     ▼
              AI Chatbot
                     │
                     ▼
             FastAPI Backend
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    NLP/AI Analysis         PostgreSQL
          │                     │
          ▼                     │
  Sentiment Detection           │
  Emotion Detection             │
  Distress Prediction           │
          │                     │
          └──────────┬──────────┘
                     ▼
             Distress Monitoring
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    Counsellor Portal       Risk Alert
          │                     │
          └──────────┬──────────┘
                     ▼
              Human Intervention
                     │
                     ▼
               IVR / Calling
                     │
                     ▼
              Victim ↔ Counsellor
```

## 🧰 Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS
* Axios
* Lucide React / UI components

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* REST APIs
* CORS middleware

### Database

* PostgreSQL
* psycopg2 / PostgreSQL driver

### AI / Machine Learning

* Python
* NLP
* Transformer architectures
* RoBERTa
* Mental-health domain-specific models
* Sentiment analysis
* Emotion classification
* Distress prediction

### Communication

* IVR / telephony API
* Victim-counsellor call bridging

## 📁 High-Level Project Structure

```text
AI-Powered-Dynamic-Mental-Health-Monitoring/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── counselor/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── ai/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── ml/
│   ├── models/
│   ├── preprocessing/
│   ├── training/
│   └── inference/
│
├── docs/
│   ├── architecture/
│   └── diagrams/
│
└── README.md
```

## 🚀 Key Features

* ✅ AI-powered conversational support
* ✅ Dynamic distress monitoring
* ✅ Sentiment analysis
* ✅ Emotion detection
* ✅ Distress-level prediction
* ✅ Historical distress tracking
* ✅ Victim/user dashboard
* ✅ Counsellor dashboard
* ✅ Admin dashboard
* ✅ PostgreSQL database
* ✅ FastAPI REST backend
* ✅ React frontend
* ✅ Secure API communication
* ✅ Victim-counsellor assignment
* ✅ IVR-based counselling calls
* ✅ Risk-based intervention
* ✅ Longitudinal mental-health monitoring

## 🌟 Future Scope

The system can be further enhanced with:

* Multilingual mental-health analysis
* Voice-based distress detection
* Speech emotion recognition
* Advanced risk prediction
* Personalized intervention recommendations
* Automated counsellor prioritization
* Real-time alerts
* Explainable AI for distress predictions
* Mobile application
* Wearable-device integration
* Advanced analytics and visualization
* Federated/privacy-preserving learning

## ⚠️ Important Note

This project is intended as an **AI-assisted monitoring and support system**, not as a replacement for qualified mental-health professionals, clinical diagnosis, or emergency services. AI-generated predictions should be treated as decision-support signals and reviewed appropriately by trained professionals.

## 📌 Project Goal

The ultimate goal is to build a **proactive, continuously monitoring mental-health support ecosystem** that can identify changes in distress early and help connect vulnerable individuals with appropriate human support before their situation escalates.

**AI detects → System monitors → Counsellor reviews → Human intervention supports.**
