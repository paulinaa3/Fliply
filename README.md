# Fliply
**Live Demo:** https://fliply.onrender.com/
Fliply is a full-stack web application that lets users create, study, and quiz themselves on flashcards they’ve built. It supports authenticated users, persists data with MongoDB, and includes a quiz mode that can generate practice exams from a user’s flashcard content using an external AI API.

## Architecture
- **Backend:** Node.js + Express exposing RESTful APIs (GET / POST / PUT)
- **Database:** MongoDB for storing users and flashcard data
- **AI Integration:** OpenAI API used for quiz generation
- **Deployment:** Cloud-deployed on Render

## Features
- User authentication and account-based data
- Create and manage flashcard sets
- Review and practice workflows
- AI-generated quizzes based on stored flashcards

## Tech Stack
**JavaScript, Node.js, Express, MongoDB**
