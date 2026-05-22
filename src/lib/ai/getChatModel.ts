import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import { createOllama, ollama as defaultOllama } from 'ai-sdk-ollama';

export type AiProvider = 'ollama' | 'openai';

const AI_PROVIDERS: AiProvider[] = ['ollama', 'openai'];

function resolveProvider(provider?: string): AiProvider {
  const value = (provider ?? process.env.AI_PROVIDER ?? 'ollama').toLowerCase();

  if (!AI_PROVIDERS.includes(value as AiProvider)) {
    throw new Error(
      `Invalid AI_PROVIDER "${value}". Must be one of: ${AI_PROVIDERS.join(', ')}`,
    );
  }

  return value as AiProvider;
}

function getOllamaModel(): LanguageModel {
  const model = process.env.OLLAMA_MODEL;
  if (!model) {
    throw new Error('OLLAMA_MODEL is not set');
  }

  const client = process.env.OLLAMA_BASE_URL
    ? createOllama({ baseURL: process.env.OLLAMA_BASE_URL })
    : defaultOllama;

  return client(model);
}

function getOpenAiModel(): LanguageModel {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  return openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini');
}

export function getChatModel(provider?: string): LanguageModel {
  const resolved = resolveProvider(provider);

  switch (resolved) {
    case 'ollama':
      return getOllamaModel();
    case 'openai':
      return getOpenAiModel();
    default: {
      const _exhaustive: never = resolved;
      return _exhaustive;
    }
  }
}
