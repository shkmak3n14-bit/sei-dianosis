import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';
import { DeepDiveCardView } from '../cards/DeepDiveCardView';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'DeepDiveCards'>;

/** 4. 深掘りカード画面（分割表示） */
export function DeepDiveCardsScreen({ navigation }: Props) {
  const { deepDiveCards } = selfUnderstandingMock;

  return (
    <ScreenContainer>
      <Text variant="titleMedium" style={styles.title}>
        もう少しだけ、分けて見てみよう
      </Text>
      <Text style={styles.subtitle}>カードごとに、自分の傾向を確認できます。</Text>

      <View style={styles.list}>
        {deepDiveCards.map((card) => (
          <DeepDiveCardView key={card.id} title={card.title} body={card.body} />
        ))}
      </View>

      <PrimaryButton
        label="サイと話してみる"
        onPress={() => navigation.navigate('Chat')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: sieColors.text,
    fontWeight: '700',
  },
  subtitle: {
    color: sieColors.muted,
    marginTop: -8,
  },
  list: {
    gap: 12,
  },
});
