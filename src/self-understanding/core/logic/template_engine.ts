import templates from './response_templates.json';

type ResponseTemplate = {
  type: string;
  label: string;
  flow: string[];
};

export function getTemplateByType(type: string): ResponseTemplate | undefined {
  return (templates.responseTemplates as ResponseTemplate[]).find((t) => t.type === type);
}
