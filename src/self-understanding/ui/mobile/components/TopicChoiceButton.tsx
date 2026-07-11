import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

/** 理解度チェック用の選択ボタン（タップで選択） */
export function TopicChoiceButton({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.button,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
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
  },
  labelSelected: {
    color: sieColors.accentStrong,
    fontWeight: '700',
  },
});
