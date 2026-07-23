import type { RefObject } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { ChatMessage } from '../mocks/chatTypes';
import { ChatBubble } from './ChatBubble';

type Props = {
  messages: ChatMessage[];
  listRef?: RefObject<FlatList<ChatMessage> | null>;
};

export function ChatMessageList({ messages, listRef }: Props) {
  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <ChatBubble role={item.role} text={item.text} />}
      onContentSizeChange={() => listRef?.current?.scrollToEnd({ animated: true })}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
});
