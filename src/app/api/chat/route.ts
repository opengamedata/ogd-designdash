import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  stepCountIs,
} from 'ai';
import apiService from '../../../services/apiService';
import { getChatModel } from '../../../lib/ai/getChatModel';
import { z } from 'zod';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  let model;
  try {
    model = getChatModel();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid AI configuration';
    return new Response(message, { status: 500 });
  }

  const result = streamText({
    model,
    tools: {
      lookupGames: tool({
        description: 'Lookup games from the Open Game Data dataset repository.',
        inputSchema: z.object({}),
        execute: async () => {
          return apiService.getGames();
        },
      }),
      getGameManifest: tool({
        description:
          'Get the manifest for a game from the Open Game Data dataset repository. A manifest documents the features (definition, datatype, etc.) available and other metadata for a game.',
        inputSchema: z.object({
          gameName: z.string(),
          year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
          month: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Month must be 01-12'),
        }),
        execute: async ({ gameName, year, month }) => {
          const manifest = await apiService.getGameManifest(
            gameName,
            year,
            month,
          );
          return manifest.val.features;
        },
      }),
      addDataset: tool({
        description:
          'Fetch a dataset from the Open Game Data dataset repository and add it to the local storage. Use your best judgement to convert user input into valid input for this tool.',
        inputSchema: z.object({
          game: z.string(),
          month: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Month must be 01-12'),
          year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
          level: z.enum(['population', 'player', 'session']),
        }),
      }),
    },
    onAbort: () => {
      console.log('Aborting...');
    },
    onFinish: () => {
      console.log('Finished...');
    },
    onError: (error) => {
      console.log('Error...', error);
    },
    system:
      "You are a helpful assistant that can help with questions and tasks related to Open Game Data Dashboard (a visualization tool for game data). It's safe to assume that the user is not technical, so don't use programming terms or jargon.",
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
  });
  return result.toUIMessageStreamResponse();
}
