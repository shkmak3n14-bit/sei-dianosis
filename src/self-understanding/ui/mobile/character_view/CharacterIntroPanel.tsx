import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterSpeechBubble } from './CharacterSpeechBubble';
import { sieColors } from '../theme';

type Props = {
  name: string;
  message: string;
};

/**
 * @deprecated 導入画面は CharacterSlideInStage を使用。
 * 他画面で簡易表示が必要な場合の互換コンポーネント。
 */
export function CharacterIntroPanel({ name, message }: Props) {
  return (
    <View style={styles.wrap}>
      <CharacterSpeechBubble text={message} />
      <CharacterAvatar name={name} size={96} />
      <Text variant="titleLarge" style={styles.name}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  name: {
    color: sieColors.accentStrong,
    fontWeight: '700',
  },
});
