# Library-Management-System

# Node.js Express App with Docker

This project is a simple Node.js web application built using Express framework and containerized with Docker. It demonstrates how to use Docker and Docker Compose to set up and run a Node.js application in a containerized environment.

## Prerequisites

Make sure you have the following installed on your machine before running the application:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to run the application locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-node-app.git
    cd your-node-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the application:

    ```bash
    npm start
    ```

4. Access the application in your browser at `http://localhost:3000`

## Docker Setup

This application can also be run using Docker containers. Docker Compose is configured to set up both the Node.js application and a MongoDB database.

To run the app with Docker, follow these steps:

1. Build the Docker images:

    ```bash
    docker-compose build
    ```

2. Start the containers:

    ```bash
    docker-compose up
    ```

3. Access the application in your browser at `http://localhost:3000`

## Configuration

- The default port for the Node.js application is `3000`. You can change this by setting the `PORT` environment variable.
- MongoDB connection settings can be modified in the `docker-compose.yml` file or via environment variables.

## Project Structure

- `app.js`: Entry point of the Node.js application.
- `routes/`: Contains route definitions.
- `controllers/`: Holds the logic for route handling.
- `models/`: Includes database models (if applicable).
- `Dockerfile`: Configuration for building the Node.js app image.
- `docker-compose.yml`: Defines services, networks, and volumes for Docker Compose.
