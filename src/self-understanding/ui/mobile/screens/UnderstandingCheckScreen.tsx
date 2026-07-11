import { useState } from 'react';
import { StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterPromptHeader } from '../character_view/CharacterPromptHeader';
import { ScreenContainer } from '../components/ScreenContainer';
import { TopicChoiceList } from '../components/TopicChoiceList';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'UnderstandingCheck'>;

/**
 * 3. 理解度チェック画面（選択式）
 * キャラが「どの部分を詳しく知りたい？」と尋ね、トピックをタップ選択する。
 */
export function UnderstandingCheckScreen({ navigation }: Props) {
  const { understandingCheck } = selfUnderstandingMock;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    setSelectedId(optionId);
    // タップで選択 → 深掘りへ（選択結果は後で core 連携時に利用）
    navigation.navigate('DeepDiveCards', { topicId: optionId });
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <CharacterPromptHeader
        name={understandingCheck.characterName}
        bubbleText={understandingCheck.bubbleText}
      />

      <TopicChoiceList
        options={understandingCheck.options}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
});
