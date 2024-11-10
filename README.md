# Passport.js Authentication with Local, Google, and GitHub Strategies

This repository demonstrates user authentication using the Passport.js middleware with three strategies: Local, Google, and GitHub.

## Features

-   **Local Authentication**: Sign up and log in with email and password.
-   **Google Authentication**: OAuth-based sign-in using a Google account.
-   **GitHub Authentication**: OAuth-based sign-in using a GitHub account.
-   **Session Management**: Uses Express sessions to maintain logged-in user state.

## Technologies Used

-   **Node.js** with **Express**
-   **Passport.js** with **LocalStrategy**, **GoogleStrategy**, and **GitHubStrategy**
-   **MongoDB** for user storage (using Mongoose)
-   **dotenv** for environment variable management
-   **express-session** for session management
