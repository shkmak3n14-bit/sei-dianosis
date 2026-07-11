import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CharacterAvatar } from './CharacterAvatar';
import { sieColors } from '../theme';

type Props = {
  name: string;
  bubbleText: string;
  onPress?: () => void;
};

/**
 * 画面下に半分だけ見えるキャラ吹き出し。
 * ワイヤー: 「気になるところ、ある？」
 */
export function CharacterPeekBubble({ name, bubbleText, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.peekWrap} accessibilityRole="button">
      <View style={styles.peekInner}>
        <View style={styles.avatarClip}>
          <CharacterAvatar name={name} size={72} />
        </View>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{bubbleText}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  peekWrap: {
    backgroundColor: sieColors.surfaceSoft,
    borderTopWidth: 1,
    borderTopColor: sieColors.border,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 4,
    overflow: 'hidden',
  },
  peekInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: -28,
  },
  avatarClip: {
    height: 44,
    overflow: 'hidden',
  },
  bubble: {
    flex: 1,
    backgroundColor: sieColors.surface,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: sieColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 28,
  },
  bubbleText: {
    color: sieColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
