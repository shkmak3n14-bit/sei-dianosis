import { useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatBubble } from './ChatBubble';
import InputBox from './InputBox';
import { useChatFlow, type ChatFlowMessage } from './useChatFlow';
import { FixedCharacterHeader } from './FixedCharacterHeader';
import { sieColors } from '../theme';

export default function ChatScreen() {
  const { messages, sendMessage } = useChatFlow();
  const listRef = useRef<FlatList<ChatFlowMessage>>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <FixedCharacterHeader name="サイ" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <FlatList
          ref={listRef}
          data={messages}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ChatBubble sender={item.sender} text={item.text} />
          )}
          keyExtractor={(_, index) => index.toString()}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <InputBox onSend={sendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: sieColors.bg,
  },
  flex: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
