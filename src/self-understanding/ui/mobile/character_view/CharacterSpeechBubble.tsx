import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  text: string;
  /** 吹き出しのしっぽ位置（キャラ側） */
  tailAlign?: 'left' | 'center' | 'right';
};

/** キャラのセリフ吹き出し */
export function CharacterSpeechBubble({ text, tailAlign = 'center' }: Props) {
  const hugContent = tailAlign !== 'center';

  return (
    <View style={[styles.wrap, hugContent && styles.wrapStart]}>
      <View style={[styles.bubble, hugContent ? styles.bubbleHug : styles.bubbleFull]}>
        <Text style={[styles.text, hugContent && styles.textStart]}>{text}</Text>
      </View>
      <View
        style={[
          styles.tail,
          tailAlign === 'left' && styles.tailLeft,
          tailAlign === 'right' && styles.tailRight,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
  },
  wrapStart: {
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: sieColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: sieColors.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    maxWidth: 320,
  },
  bubbleFull: {
    width: '100%',
    alignSelf: 'center',
  },
  bubbleHug: {
    alignSelf: 'flex-start',
  },
  text: {
    color: sieColors.text,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  textStart: {
    textAlign: 'left',
  },
  tail: {
    width: 14,
    height: 14,
    backgroundColor: sieColors.surface,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: sieColors.border,
    transform: [{ rotate: '45deg' }],
    marginTop: -8,
  },
  tailLeft: {
    alignSelf: 'flex-start',
    marginLeft: 28,
  },
  tailRight: {
    alignSelf: 'flex-end',
    marginRight: 28,
  },
});
