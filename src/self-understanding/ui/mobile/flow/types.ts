export type SelfUnderstandingStackParamList = {
  ResultCards: undefined;
  CategoryItems: { categoryId: string };
  AskSaiTemplates: { categoryId: string; itemId: string };
  DeepDiveCards: { topicId?: string } | undefined;
  Chat: { templateText?: string } | undefined;
  AbstractWordExample: { userQuestion?: string } | undefined;
};
