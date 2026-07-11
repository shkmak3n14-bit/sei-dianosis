import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DeepDiveCardView } from '../cards/DeepDiveCardView';
import { CharacterPeekBubble } from '../character_view/CharacterPeekBubble';
import { ScreenContainer } from '../components/ScreenContainer';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'DeepDiveCards'>;

/**
 * 4. 深掘りカード画面（分割表示）
 * トピックごとのカードを並べ、画面下でキャラが経験の近さを尋ねる。
 */
export function DeepDiveCardsScreen({ navigation }: Props) {
  const { deepDive } = selfUnderstandingMock;

  const goChat = () => {
    navigation.navigate('Chat');
  };

  return (
    <ScreenContainer
      contentStyle={styles.content}
      footer={
        <CharacterPeekBubble
          name={deepDive.characterName}
          bubbleText={deepDive.bubbleText}
          onPress={goChat}
        />
      }
    >
      <View style={styles.list}>
        {deepDive.cards.map((card) => (
          <DeepDiveCardView key={card.id} title={card.title} bullets={card.bullets} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 8,
  },
  list: {
    gap: 12,
  },
});
