import { Inngest } from "inngest";
import { serve } from "inngest/lambda";

const inngest = new Inngest({ id: "inngest-drill-automation" });

const processDrillData = inngest.createFunction(
  { name: "Process Drill Data", id: "process-drill-data" },
  { event: "drill/process.data" },
  async ({ event, step }) => {
    try {
      // Log that the function was triggered
      console.log("Function 'processDrillData' triggered.");
      console.log("Event data received:", JSON.stringify(event));

      // Destructure the input data from the event
      const {
        workflow_id,
        drill_id,
        drill_name,
        trial_details,
        input_video_path,
        output_video_path,
        csv_files,
        expected_metrics,
        player_info,
        sensitive,
      } = event.data;

      // Log the received data for debugging
      console.log("Processing Workflow ID:", workflow_id);
      console.log("Processing Drill ID:", drill_id);
      console.log("Trial Details:", trial_details);
      console.log("Input Video Path:", input_video_path);
      console.log("CSV Files:", csv_files);
      console.log("Expected Metrics:", expected_metrics);
      console.log("Player Info:", player_info);

      // Simulate some processing with sleep
      await step.sleep("processing-delay", "2s");

      // Example: Generate mock metrics based on input
      const metrics = expected_metrics.map((metric: string) => ({
        name: metric,
        value: Math.random().toFixed(2), // Simulate metric value generation
      }));

      // Example: Generate mock scores
      const scores = [
        { name: "Player Skill", value: Math.floor(Math.random() * 100) },  // Simulate skill score
        { name: "Player Fitness", value: Math.floor(Math.random() * 100) } // Simulate fitness score
      ];

      // Prepare the output
      const output = {
        workflow_id,
        video_path: output_video_path || input_video_path, // Default to input video path if output is not provided
        metrics: JSON.stringify(metrics), // JSON string representation of metrics
        scores: JSON.stringify(scores) // JSON string representation of scores
      };

      // Log output for debugging
      console.log("Generated Output for Workflow:", JSON.stringify(output, null, 2));

      // Return the final output
      return output;
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
  functions: [processDrillData],
});
