# Lead Manager

Lead Manager is a web application for managing leads. It allows users to add and view. The application is built using Next.js, Redux Toolkit, and Tailwind CSS for the frontend, and Express.js for the backend.

## Features

- Add new leads with name, email, and status
- View a list of all leads


## Technologies Used

- Frontend: Next.js, Redux Toolkit, Tailwind CSS,react hook form
- Backend: Express.js, MongoDB
- State Management: Redux Toolkit
- API: RTK Query

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Clone the Repository

```sh
git https://github.com/Gadisa21/lead-manager
cd lead-manager
cd backend
npm install
cd ..
cd frontend
npm install
```

### Set up the Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```
MONGO_URI=your_mongodb_uri
```     
### Start the Application

```sh
cd backend
npm node index.js
cd ..
cd frontend
npm run dev
```

The application will be running at `http://localhost:3000`.

