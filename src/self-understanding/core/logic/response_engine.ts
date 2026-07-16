import { classifyUserInput } from './classifier';
import { getTemplateByType } from './template_engine';
import { writeResponse } from './response_writer';

export type GeneratedResponse = {
  type: string;
  label?: string;
  flow: string[];
};

export function generateResponse(userInput: string): GeneratedResponse {
  const type = classifyUserInput(userInput);
  const template = getTemplateByType(type);

  if (!template) {
    return {
      type: 'fallbackExpert',
      flow: ['専門家モードで自由回答します。'],
    };
  }

  const writtenFlow = template.flow.map((step) =>
    writeResponse(type, step, userInput)
  );

  return {
    type: template.type,
    label: template.label,
    flow: writtenFlow,
  };
}
