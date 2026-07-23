import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterSlideInStage } from '../character_view/CharacterSlideInStage';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'CharacterIntro'>;

/**
 * 2. キャラ登場画面（導入）
 * 目的: 自己理解の開始を自然に伝え、キャラの存在感を出す
 */
export function CharacterIntroScreen({ navigation }: Props) {
  const { characterIntro } = selfUnderstandingMock;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <CharacterSlideInStage
        name={characterIntro.name}
        bubbleText={characterIntro.bubbleText}
        ctaLabel={characterIntro.ctaLabel}
        onPressCta={() => navigation.navigate('UnderstandingCheck')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: sieColors.bg,
  },
});
