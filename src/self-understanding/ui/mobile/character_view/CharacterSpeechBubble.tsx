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
  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={[styles.text, tailAlign !== 'center' && styles.textStart]}>{text}</Text>
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
  bubble: {
    backgroundColor: sieColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: sieColors.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: '100%',
    maxWidth: 320,
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
    marginLeft: 36,
  },
  tailRight: {
    alignSelf: 'flex-end',
    marginRight: 36,
  },
});
