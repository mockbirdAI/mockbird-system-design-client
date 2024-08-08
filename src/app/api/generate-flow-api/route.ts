import { NextRequest, NextResponse } from 'next/server';

type ResponseData = {
  nodes?: any[];
  edges?: any[];
  message?: string;
  error?: string;
};

const defaultPrompt = `
Generate a flowchart in JSON format for a system design use case. The flowchart should include the following node types:
- startNode: The starting point of the flowchart.
- codeExecutionNode: A node that executes a piece of code. It should include a "code" property with JavaScript code.
- llmNode: A node that sends a query to a language model. It should include a "prompt" property with the query text.
- dataNode: A node that holds static data. It should include a "jsonData" property with JSON data.
- blobStorageNode: A node that stores data in blob storage.

Each node should have the following properties:
- id: A unique identifier for the node.
- type: The type of the node (e.g., "startNode", "codeExecutionNode", "llmNode", "dataNode", "blobStorageNode").
- data: An object containing the node's data, including a label and any additional properties specific to the node type.
- position: An object with x and y coordinates specifying the node's position.

Each edge should have the following properties:
- id: A unique identifier for the edge.
- source: The id of the source node.
- target: The id of the target node.
- type: The type of the edge.

Example JSON output:
{
  "nodes": [
    {
      "id": "1",
      "type": "startNode",
      "data": { "label": "Start Node" },
      "position": { "x": 100, "y": 100 }
    },
    {
      "id": "2",
      "type": "codeExecutionNode",
      "data": { "label": "Execute Code", "code": "console.log('Hello, world!');" },
      "position": { "x": 300, "y": 100 }
    },
    {
      "id": "3",
      "type": "llmNode",
      "data": { "label": "Query LLM", "prompt": "What is the capital of France?" },
      "position": { "x": 500, "y": 100 }
    },
    {
      "id": "4",
      "type": "dataNode",
      "data": { "label": "Static Data", "jsonData": "{\"key\": \"value\"}" },
      "position": { "x": 700, "y": 100 }
    },
    {
      "id": "5",
      "type": "blobStorageNode",
      "data": { "label": "Blob Storage" },
      "position": { "x": 900, "y": 100 }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "type": "default" },
    { "id": "e2-3", "source": "2", "target": "3", "type": "default" },
    { "id": "e3-4", "source": "3", "target": "4", "type": "default" },
    { "id": "e4-5", "source": "4", "target": "5", "type": "default" }
  ]
}

Generate a flowchart for the following user inputed case, return ONLY the JSON.

Here is the user prompt:

`;

const generateFlowchart = async (useCase: string) => {
  const response = await fetch(`https://mockbird-node-llm-function-app.azurewebsites.net/api/openAiRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: defaultPrompt + useCase }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GPT response.');
  }

  let textResponse = await response.text();
  console.log('Raw response from Azure Function:', textResponse);  // Log the raw response

  // Preprocess the response to remove extraneous characters
  textResponse = textResponse.replace(/```/g, '').trim();
  textResponse = textResponse.replace(/^json/g, '').trim();

  console.log('Processed response:', textResponse);  // Log the processed response

  try {
    return JSON.parse(textResponse);
  } catch (error) {
    throw new Error(`Invalid JSON response: ${textResponse}`);
  }
};

export async function POST(req: NextRequest) {
  try {
    const { useCase } = await req.json();

    if (!useCase) {
      return NextResponse.json({ error: 'Use case is required.' }, { status: 400 });
    }

    const generatedFlowchart = await generateFlowchart(useCase);
    return NextResponse.json(generatedFlowchart, { status: 200 });
  } catch (error: any) {
    console.error('Error generating flowchart:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST, OPTIONS' } });
}
