import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EnneaCard9w8 } from '../cards/EnneaCard9w8';
import { PersonalityCard } from '../cards/PersonalityCard';
import { TypeBadge } from '../cards/TypeBadge';
import { CharacterPeekBubble } from '../character_view/CharacterPeekBubble';
import { ScreenContainer } from '../components/ScreenContainer';
import { ENNEA_CARD_9W8 } from '../data/enneaCard9w8';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'ResultCards'>;

/** 1. 診断結果カード画面（入口） */
export function ResultCardsScreen({ navigation }: Props) {
  const { resultCard, characterPeek } = selfUnderstandingMock;
  const is9w8 = resultCard.wingCode === '9w8';

  const goFreeInput = () => {
    navigation.navigate('Chat');
  };

  return (
    <ScreenContainer
      contentStyle={styles.content}
      footer={
        <CharacterPeekBubble
          name={characterPeek.name}
          bubbleText={characterPeek.bubbleText}
          onPress={goFreeInput}
        />
      }
    >
      <TypeBadge typeLabel={resultCard.typeLabel} wingCode={resultCard.wingCode} />

      {is9w8 ? (
        <>
          <Text style={styles.cardHeading}>診断結果カード｜タイプ9w8（穏やかで芯の強い人）</Text>
          <EnneaCard9w8 sections={ENNEA_CARD_9W8.sections} />
        </>
      ) : (
        <PersonalityCard
          title={resultCard.personalityTitle}
          highlights={resultCard.highlights}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 8,
    gap: 12,
  },
  cardHeading: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: sieColors.text,
  },
});
