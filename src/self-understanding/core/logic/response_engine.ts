import { classifyUserInput } from './classifier';
import { getTemplateByType } from './template_engine';

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

  return {
    type: responseType,
    label: template.label,
    flow: template.flow,
  };
}
