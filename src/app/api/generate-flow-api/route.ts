import { NextRequest, NextResponse } from 'next/server';

type ResponseData = {
  nodes?: any[];
  edges?: any[];
  message?: string;
  error?: string;
};

const generateFlowchart = async (useCase: string) => {
  const response = await fetch(`https://mockbird-node-llm-function-app.azurewebsites.net/api/generateFlowDiagram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ useCase: useCase }),
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
