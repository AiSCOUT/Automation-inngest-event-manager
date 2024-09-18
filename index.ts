import { Inngest } from "inngest";
import { serve } from "inngest/lambda";
import AWS from 'aws-sdk'; // Import the AWS SDK

// Create a new AWS Lambda client
const lambda = new AWS.Lambda();

const inngest = new Inngest({ id: "automation" , isDev: false});

const workflowStart = inngest.createFunction(
  { id: "workflow-start" },
  { event: "automation/workflow.start" },
  async ({ event, step }) => {
    try {
      // Log that the function was triggered
      console.log("Function 'processDrillData' triggered.");
      console.log("Event data received:", JSON.stringify(event));

      // // Extract the Lambda ID from the event object
      // const { lambdaID, payload } = event; // Assuming the event contains lambdaID and payload keys

      // if (!lambdaID) {
      //   throw new Error("No lambdaID found in event");
      // }

      // // Prepare the parameters to invoke another Lambda function
      // const params = {
      //   FunctionName: lambdaID, // The ID or ARN of the Lambda function to invoke
      //   InvocationType: "Event", // Event type for asynchronous execution
      //   Payload: JSON.stringify(payload || {}), // The payload to pass to the triggered Lambda
      // };

      // // Invoke the Lambda function using AWS SDK
      // const result = await lambda.invoke(params).promise();

      // console.log(`Lambda function '${lambdaID}' invoked successfully`, result);

      // // Return the final output
      // return { status: "success", result, event };
      await step.sleep("wait-for-a-sec", "1s");
      return "Hello World";
    } catch (err) {
      console.error("Error processing drill data:", err);
      throw err; // Rethrow the error so it gets logged
    }
  }
);

// Log that the Inngest handler is starting
console.log("Starting Inngest handler...");
export const handler = serve({
  client: inngest,
  functions: [workflowStart], //we can add event handlers for each drill, or use one for all
});