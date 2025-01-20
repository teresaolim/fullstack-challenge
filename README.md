
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


ANSWER TO THE LAST QUESTION

I think the reason road covers are round likely has to do with a few practical factors.
First off, I believe the round shape is probably stronger and better at distributing weight. A circle can spread the load evenly across its surface, which makes it less likely to crack or break under the pressure of heavy vehicles. If the cover were a different shape, like square or rectangular, the edges and corners might take more of the strain, which could lead to more damage over time.
Another reason I think round covers are so common is that they’re just easier to work with. When road workers are installing or removing them, they don’t have to worry about getting the alignment just right. With a round cover, they can drop it into place without worrying about whether it's facing the right direction. I suppose this makes maintenance much quicker and simpler, which would be especially important if this maintenance is done regularly.
Finally, I think the round shape might have been chosen because it’s safer. A round cover can't fall into the hole, no matter how it's rotated. Since the diameter is the same all around, there's no risk of it slipping through. But if the cover were a square or rectangle, it could potentially fall into the hole if it's turned the wrong way. So, in terms of safety, round just seems to be the more reliable option.
So, while I can’t say for sure, I believe the round design just works better in terms of strength, ease of use, and safety, which is probably why it’s so widely used.