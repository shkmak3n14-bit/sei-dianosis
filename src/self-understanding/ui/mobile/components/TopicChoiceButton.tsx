import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  label: string;
  /** ボタン下に表示する本文（改行可） */
  body?: string;
  selected?: boolean;
  onPress: () => void;
};

/** 理解度チェック用の選択ボタン（タップで選択） */
export function TopicChoiceButton({ label, body, selected = false, onPress }: Props) {
  const hasBody = Boolean(body?.trim());

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.button,
        hasBody && styles.buttonWithBody,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
        <Text
          style={[
            styles.label,
            hasBody && styles.labelStart,
            selected && styles.labelSelected,
          ]}
        >
          {label}
        </Text>
        {hasBody ? <Text style={styles.body}>{body}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: sieColors.surface,
    borderWidth: 1.5,
    borderColor: sieColors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonWithBody: {
    minHeight: 72,
    alignItems: 'stretch',
  },
  inner: {
    gap: 8,
  },
  selected: {
    borderColor: sieColors.accent,
    backgroundColor: sieColors.surfaceSoft,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  label: {
    color: sieColors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  labelStart: {
    textAlign: 'left',
  },
  labelSelected: {
    color: sieColors.accentStrong,
    fontWeight: '700',
  },
  body: {
    color: sieColors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'left',
  },
});
