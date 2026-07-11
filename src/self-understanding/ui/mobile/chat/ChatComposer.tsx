import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import type { ChatChoice, ChatInputMode } from '../mocks/chatTypes';
import { PrimaryButton } from '../components/PrimaryButton';
import { sieColors } from '../theme';
import { ChatChoiceBar } from './ChatChoiceBar';

type Props = {
  inputMode: ChatInputMode;
  choices?: ChatChoice[];
  draft: string;
  onChangeDraft: (value: string) => void;
  onSelectChoice: (choice: ChatChoice) => void;
  onSubmitText: () => void;
  placeholder?: string;
};

/**
 * 入力エリア。
 * - choice: 選択のみ
 * - choiceOrText: 選択 or 自由入力
 * - text: 自由入力のみ
 * - none: 入力なし（完了）
 */
export function ChatComposer({
  inputMode,
  choices = [],
  draft,
  onChangeDraft,
  onSelectChoice,
  onSubmitText,
  placeholder = '気持ちや場面を書いてみる',
}: Props) {
  if (inputMode === 'none') {
    return (
      <View style={styles.wrap}>
        <Text style={styles.doneText}>いったんここまで。また続きから話せます。</Text>
      </View>
    );
  }

  const showChoices = inputMode === 'choice' || inputMode === 'choiceOrText';
  const showText = inputMode === 'text' || inputMode === 'choiceOrText';

  return (
    <View style={styles.wrap}>
      {showChoices && choices.length > 0 ? (
        <ChatChoiceBar choices={choices} onSelect={onSelectChoice} />
      ) : null}

      {showText ? (
        <View style={styles.textBlock}>
          {inputMode === 'choiceOrText' ? (
            <Text style={styles.hint}>または、自由に書いて送る</Text>
          ) : null}
          <TextInput
            mode="outlined"
            value={draft}
            onChangeText={onChangeDraft}
            placeholder={placeholder}
            style={styles.input}
            outlineColor={sieColors.border}
            activeOutlineColor={sieColors.accent}
            multiline
            dense
          />
          <PrimaryButton label="送る" onPress={onSubmitText} disabled={!draft.trim()} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: sieColors.border,
    backgroundColor: sieColors.surfaceSoft,
  },
  textBlock: {
    gap: 8,
  },
  hint: {
    color: sieColors.muted,
    fontSize: 12,
  },
  input: {
    backgroundColor: sieColors.surface,
    maxHeight: 120,
  },
  doneText: {
    color: sieColors.muted,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
