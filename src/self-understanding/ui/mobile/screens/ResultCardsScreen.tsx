import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PersonalityCard } from '../cards/PersonalityCard';
import { TypeBadge } from '../cards/TypeBadge';
import { CharacterPeekBubble } from '../character_view/CharacterPeekBubble';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'ResultCards'>;

/** 1. 診断結果カード画面（入口） */
export function ResultCardsScreen({ navigation }: Props) {
  const { resultCard, characterPeek } = selfUnderstandingMock;

  const goNext = () => {
    navigation.navigate('CharacterIntro');
  };

  return (
    <ScreenContainer
      contentStyle={styles.content}
      footer={
        <CharacterPeekBubble
          name={characterPeek.name}
          bubbleText={characterPeek.bubbleText}
          onPress={goNext}
        />
      }
    >
      <TypeBadge typeLabel={resultCard.typeLabel} wingCode={resultCard.wingCode} />

      <PersonalityCard
        title={resultCard.personalityTitle}
        highlights={resultCard.highlights}
      />

      <View style={styles.actions}>
        <PrimaryButton label="もっと詳しく見る" onPress={goNext} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 8,
  },
  actions: {
    marginTop: 8,
  },
});
