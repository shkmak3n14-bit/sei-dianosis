import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterIntroPanel } from '../character_view/CharacterIntroPanel';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'CharacterIntro'>;

/** 2. キャラ登場画面（導入） */
export function CharacterIntroScreen({ navigation }: Props) {
  const { characterPeek, introMessage } = selfUnderstandingMock;

  return (
    <ScreenContainer>
      <CharacterIntroPanel name={characterPeek.name} message={introMessage} />
      <PrimaryButton
        label="理解度チェックへ"
        onPress={() => navigation.navigate('UnderstandingCheck')}
      />
    </ScreenContainer>
  );
}
