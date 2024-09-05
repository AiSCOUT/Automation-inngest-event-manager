#!/bin/bash

# Step 1: Install dependencies
echo "Installing npm dependencies for Inngest Drill Automation..."
npm install || { echo "npm install failed"; exit 1; }

# Step 2: Check if a previous container is running and stop it
CONTAINER_ID=$(docker ps -q --filter ancestor=inngest-drill-automation)
if [ "$CONTAINER_ID" ]; then
  echo "Stopping the running Docker container..."
  docker stop "$CONTAINER_ID" || { echo "Failed to stop container"; exit 1; }
fi

# Step 3: Remove any previous containers
if [ "$CONTAINER_ID" ]; then
  echo "Removing the stopped Docker container..."
  docker rm "$CONTAINER_ID" || { echo "Failed to remove container"; exit 1; }
fi

# Step 4: Build the Docker image
echo "Building Docker image for Inngest Drill Automation..."
docker build -t inngest-drill-automation . || { echo "Docker build failed"; exit 1; }

# Step 5: Run the Docker container with INNGEST_BASE_URL environment variable
echo "Running Docker container for Inngest Drill Automation..."
docker run -d -p 9000:8080 -e INNGEST_BASE_URL=http://host.docker.internal:8288 inngest-drill-automation || { echo "Docker run failed"; exit 1; }

# Step 6: Wait for the server to start up
echo "Waiting for the server to start on port 9000..."
sleep 5  # Adjust this value if your server takes longer to start

# Step 7: Test the local server using Inngest CLI
echo "Testing local server for Inngest Drill Automation with Inngest CLI..."
npx inngest-cli@latest dev -u http://localhost:9000/2015-03-31/functions/function/invocations || { echo "Inngest CLI test failed"; exit 1; }

# Step 8: Display Docker container logs
echo "Displaying Docker container logs for Inngest Drill Automation..."
docker logs $(docker ps -q --filter ancestor=inngest-drill-automation)

echo "Inngest Drill Automation script completed successfully."
