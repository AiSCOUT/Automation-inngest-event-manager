#!/bin/bash

# Set variables
AWS_REGION="eu-west-2"
AWS_ACCOUNT_ID="944727373196"
ECR_REPOSITORY="inngest"
IMAGE_TAG="latest"

# Full ECR repository URL
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Authenticate Docker to AWS ECR
echo "Authenticating Docker to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if [ $? -ne 0 ]; then
    echo "Failed to authenticate Docker to ECR. Please check your AWS credentials and permissions."
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build --platform linux/amd64 -t $ECR_REPOSITORY .

if [ $? -ne 0 ]; then
    echo "Docker image build failed."
    exit 1
fi

# Tag the Docker image
echo "Tagging Docker image..."
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_URI

if [ $? -ne 0 ]; then
    echo "Failed to tag Docker image."
    exit 1
fi

# Push the Docker image to ECR
echo "Pushing Docker image to ECR..."
docker push $ECR_URI

if [ $? -ne 0 ]; then
    echo "Failed to push Docker image to ECR."
    exit 1
fi

echo "Docker image successfully pushed to ECR: $ECR_URI"

# OPTIONAL: Update AWS Lambda with the new image
LAMBDA_FUNCTION_NAME="inngest"
echo "Updating Lambda function $LAMBDA_FUNCTION_NAME with new image..."

aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --image-uri $ECR_URI

if [ $? -ne 0 ]; then
    echo "Failed to update the Lambda function."
    exit 1
fi

echo "Lambda function $LAMBDA_FUNCTION_NAME successfully updated with new Docker image."

