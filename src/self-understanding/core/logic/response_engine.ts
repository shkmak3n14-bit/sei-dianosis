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
  const template = getTemplateByType(type) ?? getTemplateByType('fallbackExpert');

  if (!template) {
    return {
      type: 'fallbackExpert',
      flow: ['専門家モードで自由回答します。'],
    };
  }

  // テンプレート type を優先（relationshipTrouble → relationshipIssue など）
  const responseType = template.type;

  const writtenFlow = template.flow.map((step) =>
    writeResponse(responseType, step, userInput)
  );

  return {
    type: responseType,
    label: template.label,
    flow: writtenFlow,
  };
}
