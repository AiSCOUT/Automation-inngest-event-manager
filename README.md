# Inngest Drill Automation - Local Testing Guide (Linux)

## Overview

This repository contains a serverless event-driven function using the **Inngest** framework. It processes drill data based on an incoming event. This guide will help you set up and test the project locally on a Linux machine.

## Prerequisites

Ensure that your system meets the following requirements before you begin:

1. **Docker**: Docker is required to build and run the container locally. Install Docker by following the official [Docker Installation Guide](https://docs.docker.com/engine/install/).
2. **Node.js**: The project uses **Node.js v18**. If you don't have it installed, you can install it using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) or directly from the [Node.js website](https://nodejs.org/).
3. **npm**: Ensure **npm** (Node Package Manager) is installed alongside Node.js.
4. **Inngest CLI**: The **Inngest CLI** is used to test functions locally.

## Local Setup

If you're on linux, run this script for a seamless process of installation and run:

```bash
chmod +x build_run_test.sh  # Make the script executable
./build_run_test.sh         # Run the script
```

## The script above will:

- Install the npm dependencies.
- Stop any running Docker containers based on the inngest-drill-automation image.
- Remove stopped containers.
- Build a new Docker image for the project.
- Run the Docker container.
- Start the Inngest dev server using the Inngest CLI.

##  Testing with Inngest CLI
After running the script, the Inngest dev server will start on port 8288 and your Docker container will be linked to it. You can monitor the logs from the terminal to observe how the events are processed.
. You can use the .json payload in the dir to test.

If successful, you will see logs similar to:
Inngest Dev Server online at 0.0.0.0:8288, visible at the following URLs:


## OPTIONAL Manual install, build and run commands:
```bash
- http://127.0.0.1:8288
- http://192.168.1.53:8288
```

```bash
npm install
```

```bash
docker build -t inngest-drill-automation .
```

```bash
docker run -p 9000:8080 -e INNGEST_BASE_URL=http://host.docker.internal:8288 inngest-drill-automation
```

```bash
npx inngest-cli@latest dev -u http://localhost:9000/2015-03-31/functions/function/invocations
```
