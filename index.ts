import { Inngest } from "inngest";
import { serve } from "inngest/lambda";
import AWS from 'aws-sdk'; // Import the AWS SDK

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

      // Build a drill config dict
      let drill_config = {};
      if (event.data.drill === "aiscout-drill-pressups-knees") {
        drill_config = { knees: true };
      } else if (event.data.drill === "aiscout-drill-pressups-knees-15s") {
        drill_config = { knees: false, time_limit: 15 };
      } else if (event.data.drill === "aiscout-drill-pressups-15s") {
        drill_config = { time_limit: 15 };
      } else if (event.data.drill === "aiscout-drill-5-0-5-sprint-left") {
        drill_config = { turn_direction: "left" };
      } else if (event.data.drill === "aiscout-drill-5-0-5-sprint-right") {
        drill_config = { turn_direction: "right" };
      }
      
      // Add/overwrite drill config on the event data
      event.data.drill_config = drill_config;

      // Prepare the parameters to invoke another Lambda function
      const params = {
        FunctionName: "aiscout-skeleton-overlay",
        InvocationType: "Event", // Asynchronous execution
        Payload: JSON.stringify(event.data || {}), 
      };
      if (!event.data.async) {
        params.InvocationType = "RequestResponse"; // Synchronous execution
        const result = await lambda.invoke(params).promise();
        console.log("Lambda function invoked synchronously:", result);
      } else {


        // Invoke the Lambda function asynchronously
        lambda.invoke(params).promise()
          .catch((err) => {
            // Log any errors that occur during invocation, but do not block the execution
            console.error("Error invoking Lambda:", err);
          });
      }

      // Continue execution
      console.log(`Lambda function invoked asynchronously.`);

      return { "event": event, "step": step, "drill": event.data.drill };
    } catch (err) {
      console.error("Error processing drill data:", err);
      throw err;
    }
  }
);

console.log("Starting Inngest handler...");
export const handler = serve({
  client: inngest,
  functions: [workflowStart], //we can add event handlers for each drill, or use one for all
});