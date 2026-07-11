import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatComposer } from '../chat/ChatComposer';
import { ChatMessageList } from '../chat/ChatMessageList';
import { FixedCharacterHeader } from '../chat/FixedCharacterHeader';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';
import type { ChatChoice, ChatMessage } from '../mocks/chatTypes';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'Chat'>;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * 5. キャラとのチャット画面（自己理解の本体）
 * 固定キャラ＋選択／自由入力で深掘りを進める。分岐ロジックは後で core に接続。
 */
export function ChatScreen(_props: Props) {
  const { chatFlow } = selfUnderstandingMock;
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'c-start',
      role: 'character',
      text: chatFlow.steps[0]?.prompt ?? '',
    },
  ]);

  const currentStep = chatFlow.steps[stepIndex];
  const isCompleted = stepIndex >= chatFlow.steps.length;

  const inputMode = useMemo(() => {
    if (isCompleted || !currentStep) {
      return 'none' as const;
    }
    return currentStep.inputMode;
  }, [currentStep, isCompleted]);

  const advance = (userText: string) => {
    const userMessage: ChatMessage = {
      id: createId('u'),
      role: 'user',
      text: userText,
    };

    const nextIndex = stepIndex + 1;
    const nextStep = chatFlow.steps[nextIndex];

    if (nextStep) {
      const characterMessage: ChatMessage = {
        id: createId('c'),
        role: 'character',
        text: nextStep.prompt,
      };
      setMessages((prev) => [...prev, userMessage, characterMessage]);
      setStepIndex(nextIndex);
    } else {
      const doneMessage: ChatMessage = {
        id: createId('c'),
        role: 'character',
        text: chatFlow.completedMessage,
      };
      setMessages((prev) => [...prev, userMessage, doneMessage]);
      setStepIndex(chatFlow.steps.length);
    }

    setDraft('');
  };

  const handleSelectChoice = (choice: ChatChoice) => {
    advance(choice.label);
  };

  const handleSubmitText = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    advance(text);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <FixedCharacterHeader name={chatFlow.characterName} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ChatMessageList messages={messages} listRef={listRef} />

        <ChatComposer
          inputMode={inputMode}
          choices={currentStep?.choices}
          draft={draft}
          onChangeDraft={setDraft}
          onSelectChoice={handleSelectChoice}
          onSubmitText={handleSubmitText}
          placeholder={
            currentStep?.id === 'feeling'
              ? 'その時の気持ちを書いてみる'
              : '気持ちや場面を書いてみる'
          }
        />
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
});
