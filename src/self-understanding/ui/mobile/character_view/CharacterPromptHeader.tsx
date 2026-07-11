import { StyleSheet, View } from 'react-native';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterSpeechBubble } from './CharacterSpeechBubble';

type Props = {
  name: string;
  bubbleText: string;
};

/** 画面上部のキャラ＋吹き出しプロンプト */
export function CharacterPromptHeader({ name, bubbleText }: Props) {
  return (
    <View style={styles.wrap}>
      <CharacterAvatar name={name} size={64} />
      <View style={styles.bubbleWrap}>
        <CharacterSpeechBubble text={bubbleText} tailAlign="left" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bubbleWrap: {
    flex: 1,
    paddingTop: 4,
  },
});
