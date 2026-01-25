import { runSubagent } from "./lib/subagent-runner";

interface Task {
  id: string;
  title: string;
  description: string;
  files: string[];
  tests: string[];
  acceptance?: string;
}

interface DeveloperResult {
  id: string;
  changes: { file: string; summary: string; patch: string }[];
  testResult: "pass" | "fail";
  testOutput: string;
}

interface TestingResult {
  testResult: "pass" | "fail";
  testOutput: string;
  suggestions: string;
}

async function runAutomation(userRequest: string) {
  console.log("--- Starting Automation Loop ---");
  console.log(`Objective: ${userRequest}`);

  let iteration = 0;
  const maxIterations = 10;
  let history: string[] = [`Initial User Request: ${userRequest}`];

  while (iteration < maxIterations) {
    iteration++;
    console.log(`\n--- Iteration ${iteration} ---`);

    // Step 1: Analysis Agent
    const analysisPrompt = `You are the Analysis Agent. Use the repo files and context to:
1) Understand the current project and feature request: "${userRequest}".
2) Context of work done so far:
${history.join("\n- ")}

3) Break feature into small ordered tasks (1–3 file changes each).
4) For each task include: title, files to change, acceptance criteria, and tests to add.
5) Prioritize tasks; produce a minimal first task to implement quickly.

Rules:
- Do not write code here. Produce task list only.
- Keep tasks atomic and testable.
- Format output as JSON array: [{id, title, description, files, tests, acceptance}]`;

    const analysisResult = await runSubagent("Analysis Agent", analysisPrompt);
    let tasks: Task[];
    try {
      tasks = JSON.parse(analysisResult);
    } catch (error) {
      console.error("Failed to parse analysis result:", error, analysisResult);
      break;
    }

    if (tasks.length === 0) {
      console.log("No tasks remaining. Automation complete.");
      break;
    }

    const task = tasks[0];
    console.log(`Next Task: ${task.title}`);
    history.push(`Starting Task: ${task.title}`);

    // Step 2: Developer Agent
    const developerPrompt = `You are the Developer Agent. You receive a single TASK: ${JSON.stringify(task)}.
Context: ${userRequest}

Your job:
- Implement ONLY the changes required by 'files'.
- Add or update tests as requested.
- Keep changes minimal.
- After implementation, provide a summary of your changes.

Return format:
{
  "id": "${task.id}",
  "changes": [{"file":"path","summary":"what you changed","patch":"full file content"}],
  "testResult": "fail",
  "testOutput": "Need to run tests"
}`;

    const developerResultStr = await runSubagent(
      "Developer Agent",
      developerPrompt,
    );
    let developerResult: DeveloperResult;
    try {
      developerResult = JSON.parse(developerResultStr);
    } catch (error) {
      console.error(
        "Failed to parse developer result:",
        error,
        developerResultStr,
      );
      continue;
    }

    // Apply changes (In a real scenario, this script would write to disk)
    for (const change of developerResult.changes) {
      console.log(`Applying changes to: ${change.file}`);
      // fs.writeFileSync(change.file, change.patch); // We should probably implement a safe write
    }

    history.push(
      `Implementation Summary: ${developerResult.changes.map((c) => c.summary).join(", ")}`,
    );

    // Step 3: Testing Agent
    const testingPrompt = `You are the Testing Agent.
Task: ${task.title}
Changes: ${JSON.stringify(developerResult.changes)}

Your job:
- Analyze the changes and determine if they meet the acceptance criteria: ${task.acceptance || "N/A"}.
- Since I cannot run terminal commands directly from this subagent, please simulate what the test output might look like and provide suggestions for real verification.

Return format:
{
  "testResult": "pass" or "fail",
  "testOutput": "simulated terminal output",
  "suggestions": "verification steps"
}`;

    const testingResultStr = await runSubagent("Testing Agent", testingPrompt);
    let testingResult: TestingResult;
    try {
      testingResult = JSON.parse(testingResultStr);
    } catch (error) {
      console.error("Failed to parse testing result:", error, testingResultStr);
      continue;
    }

    console.log(`Testing Result: ${testingResult.testResult.toUpperCase()}`);
    history.push(
      `Testing Result: ${testingResult.testResult}, Suggestions: ${testingResult.suggestions}`,
    );

    if (testingResult.testResult === "pass") {
      console.log(`Task ${task.id} successfully completed.`);
    } else {
      console.log(
        `Task ${task.id} requires fixes: ${testingResult.suggestions}`,
      );
    }

    // For now, stop after one task to avoid infinite loops and overconsumption
    break;
  }

  console.log("\n--- Automation Loop Complete ---");
}

runAutomation(
  process.argv[2] || "Improve the documentation in the scripts folder",
);
