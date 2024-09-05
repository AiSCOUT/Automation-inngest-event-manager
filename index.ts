import { Inngest } from "inngest";
import { serve } from "inngest/lambda";

const inngest = new Inngest({ id: "inngest-drill-automation" });

const processDrillData = inngest.createFunction(
  { name: "Process Drill Data", id: "process-drill-data" },
  { event: "drill/process.data" },
  async ({ event, step }) => {
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

    // Simulate some processing with sleep and log the received data
    await step.sleep("processing-delay", "2s");

    console.log("Processing Workflow ID:", workflow_id);
    console.log("Processing Drill ID:", drill_id);
    console.log("Trial Details:", trial_details);
    console.log("Input Video Path:", input_video_path);
    console.log("CSV Files:", csv_files);
    console.log("Expected Metrics:", expected_metrics);
    console.log("Player Info:", player_info);

    // Example: Generate mock metrics based on input
    const metrics = expected_metrics.map(metric => ({
      name: metric,
      value: Math.random().toFixed(2), // Simulate metric value generation
    }));

    // Example: Generate mock scores (assuming scores are calculated based on player information)
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
    console.log("Generated Output for Workflow:", output);

    // Return the final output
    return output;
  }
);

// Set INNGEST_BASE_URL=http://host.docker.internal:8288 for local dev within Docker
export const handler = serve({
  client: inngest,
  functions: [processDrillData],
});
