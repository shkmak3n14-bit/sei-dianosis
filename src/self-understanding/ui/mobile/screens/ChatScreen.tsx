import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatBubble } from '../chat/ChatBubble';
import { PrimaryButton } from '../components/PrimaryButton';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';
import type { ChatMessage } from '../mocks/types';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'Chat'>;

/** 5. キャラとのチャット画面（自己理解の本体） */
export function ChatScreen(_props: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(selfUnderstandingMock.chatMessages);
  const [draft, setDraft] = useState('');

  const send = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };

    // mock: 固定のキャラ返答（後で core/logic に接続）
    const reply: ChatMessage = {
      id: `c-${Date.now()}`,
      role: 'character',
      text: 'ありがとう。その感覚、もう少し具体的に教えてくれる？',
    };

    setMessages((prev) => [...prev, userMessage, reply]);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ChatBubble role={item.role} text={item.text} />}
        />

        <View style={styles.composer}>
          <TextInput
            mode="outlined"
            value={draft}
            onChangeText={setDraft}
            placeholder="気持ちや場面を書いてみる"
            style={styles.input}
            outlineColor={sieColors.border}
            activeOutlineColor={sieColors.accent}
            dense
          />
          <PrimaryButton label="送る" onPress={send} disabled={!draft.trim()} />
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  composer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: sieColors.border,
    backgroundColor: sieColors.surfaceSoft,
  },
  input: {
    backgroundColor: sieColors.surface,
  },
});
