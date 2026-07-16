import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterPromptHeader } from '../character_view/CharacterPromptHeader';
import { ScreenContainer } from '../components/ScreenContainer';
import { TopicChoiceButton } from '../components/TopicChoiceButton';
import { UNDERSTANDING_CHECK_9W8 } from '../data/understandingCheck9w8';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'UnderstandingCheck'>;

/**
 * ① カテゴリ画面
 * ボタンを押すと CategoryItems へ遷移する
 */
export function UnderstandingCheckScreen({ navigation }: Props) {
  const { understandingCheck } = selfUnderstandingMock;

  return (
    <ScreenContainer contentStyle={styles.content}>
      <CharacterPromptHeader
        name={understandingCheck.characterName}
        bubbleText={understandingCheck.bubbleText}
      />

      <View style={styles.list}>
        {UNDERSTANDING_CHECK_9W8.categories.map((category) => (
          <TopicChoiceButton
            key={category.id}
            label={category.title}
            onPress={() => navigation.navigate('CategoryItems', { categoryId: category.id })}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  list: {
    gap: 10,
  },
});
