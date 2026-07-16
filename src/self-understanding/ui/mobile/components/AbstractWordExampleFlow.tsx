import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ExampleStoryTemplate } from '../data/exampleStoryWeakness';
import { EXAMPLE_STORY_WEAKNESS } from '../data/exampleStoryWeakness';
import { askSaiLlm } from '../logic/askSaiLlm';
import { sieColors } from '../theme';

type Phase = 'story' | 'followups' | 'input' | 'loading' | 'reply';

type Props = {
  template?: ExampleStoryTemplate;
  /** ユーザーが抽象語を質問した文言（未指定時はテンプレート語から生成） */
  userQuestion?: string;
};

type Bubble = {
  id: string;
  role: 'sai' | 'user';
  text: string;
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatExampleStory(template: ExampleStoryTemplate): string {
  return [template.exampleStory.title, '', ...template.exampleStory.text].join('\n');
}

/**
 * 抽象語質問 → 例え話 → フォロー質問 → 自由入力 → LLM返答
 */
export function AbstractWordExampleFlow({
  template = EXAMPLE_STORY_WEAKNESS,
  userQuestion,
}: Props) {
  const question =
    userQuestion?.trim() ||
    `「${template.abstractWord}」って、私の場合どんな感じですか？`;

  const listRef = useRef<FlatList<Bubble>>(null);
  const [phase, setPhase] = useState<Phase>('story');
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [bubbles, setBubbles] = useState<Bubble[]>(() => [
    { id: 'u-q', role: 'user', text: question },
  ]);

  const followUps = template.followUpQuestions;

  useEffect(() => {
    const timer = setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: createId('s'),
          role: 'sai',
          text: formatExampleStory(template),
        },
      ]);
      setPhase('followups');
      setFollowUpIndex(0);
    }, 350);

    return () => clearTimeout(timer);
  }, [template]);

  useEffect(() => {
    if (phase !== 'followups') {
      return;
    }

    if (followUpIndex >= followUps.length) {
      setPhase('input');
      return;
    }

    const timer = setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: createId('s'),
          role: 'sai',
          text: followUps[followUpIndex],
        },
      ]);
      setFollowUpIndex((index) => index + 1);
    }, 450);

    return () => clearTimeout(timer);
  }, [phase, followUpIndex, followUps]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [bubbles, phase]);

  const canSubmit = useMemo(
    () => phase === 'input' && draft.trim().length > 0,
    [phase, draft]
  );

  const handleSubmit = async () => {
    const userInput = draft.trim();
    if (!userInput || phase !== 'input') {
      return;
    }

    setBubbles((prev) => [
      ...prev,
      { id: createId('u'), role: 'user', text: userInput },
    ]);
    setDraft('');
    setPhase('loading');

    const { reply } = await askSaiLlm({
      userQuestion: question,
      exampleStory: template.exampleStory,
      userInput,
    });

    setBubbles((prev) => [
      ...prev,
      { id: createId('s'), role: 'sai', text: reply },
    ]);
    setPhase('reply');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>サイ</Text>
        <Text style={styles.headerSub}>抽象語の例え話</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <FlatList
          ref={listRef}
          data={bubbles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.saiBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.role === 'user' ? styles.userText : styles.saiText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
        />

        {phase === 'loading' ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={sieColors.accent} />
            <Text style={styles.loadingText}>サイが整理しています…</Text>
          </View>
        ) : null}

        {phase === 'input' || phase === 'reply' ? (
          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="話せる範囲で、あなたの経験を書いてください"
              placeholderTextColor={sieColors.muted}
              multiline
              editable={phase === 'input'}
              style={styles.input}
            />
            <Pressable
              style={[styles.sendButton, !canSubmit && styles.sendButtonDisabled]}
              disabled={!canSubmit}
              onPress={handleSubmit}
            >
              <Text style={styles.sendLabel}>送る</Text>
            </Pressable>
          </View>
        ) : null}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: sieColors.border,
    backgroundColor: sieColors.surfaceSoft,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: sieColors.accentStrong,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 13,
    color: sieColors.muted,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  bubble: {
    maxWidth: '92%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  saiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: sieColors.surface,
    borderColor: sieColors.border,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: sieColors.surfaceSoft,
    borderColor: sieColors.accent,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 24,
  },
  saiText: {
    color: sieColors.text,
  },
  userText: {
    color: sieColors.text,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  loadingText: {
    fontSize: 13,
    color: sieColors.muted,
  },
  composer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: sieColors.border,
    backgroundColor: sieColors.surfaceSoft,
    gap: 8,
  },
  input: {
    minHeight: 88,
    maxHeight: 140,
    borderWidth: 1,
    borderColor: sieColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: sieColors.surface,
    color: sieColors.text,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  sendButton: {
    alignSelf: 'flex-end',
    backgroundColor: sieColors.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
