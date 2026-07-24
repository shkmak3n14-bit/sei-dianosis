import { useEffect, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { sieColors } from '../theme';
import { ChatBubble } from './ChatBubble';
import { FixedCharacterHeader } from './FixedCharacterHeader';
import InputBox from './InputBox';
import { useChatFlow, type ChatFlowMessage } from './useChatFlow';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'Chat'>;

export default function ChatScreen({ route }: Props) {
  const { messages, sendMessage, sendVoiceMessage } = useChatFlow();
  const listRef = useRef<FlatList<ChatFlowMessage>>(null);
  const didSendTemplateRef = useRef(false);

  useEffect(() => {
    const templateText = route.params?.templateText?.trim();
    if (!templateText || didSendTemplateRef.current) {
      return;
    }
    didSendTemplateRef.current = true;
    void sendMessage(templateText);
  }, [route.params?.templateText, sendMessage]);

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
          renderItem={({ item }) => <ChatBubble sender={item.sender} text={item.text} />}
          keyExtractor={(_, index) => index.toString()}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <InputBox onSend={sendMessage} onVoiceRecorded={sendVoiceMessage} />
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
