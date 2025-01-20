
Fullstack To-Do List Application

Welcome to my fullstack to-do list application! This project is built using Node.js, Express, Knex.js, SQLite for the backend, and React for the frontend. It’s a simple yet functional app where you can manage your tasks efficiently.

FEATURES

Here’s what the app can do:
- Add, edit, delete, and toggle tasks as complete or incomplete.
- Sort tasks:
   * Alphabetically (A-Z or Z-A).
   * By creation date (oldest to newest or reverse).
   * By completion date.
- Filter tasks by their status: view all tasks, only completed tasks, or only incomplete ones.

INSTALLATION AND SETUP

Here’s how you can set up and run the project locally:
1 - Clone the repository: 
    git clone <https://github.com/teresaolim/fullstack-challenge>

2 - Go to the project directory: 
    cd fullstack-todo

3 - Install the dependencies:
# For the backend
    npm install

# For the frontend
    cd frontend
    npm install
    cd ..

4 - Set up the database:
# Run database migrations to set up the schema
    npx knex migrate:latest

5 - Start the backend:
    npm run dev

6 - Start the frontend:
    cd frontend
    npm run dev

7 - Access the app:
# Backend: http://localhost:3000
# Frontend: http://localhost:5173

That’s it! Your app should now be up and running.

TECHNOLOGIES USED

- Backend
* Node.js and Express.js: For the server and API.
* Knex.js and SQLite: For database management.
* Zod: To validate inputs and outputs.

- Frontend
* React.js: For building the user interface.
* Axios: To handle API requests.