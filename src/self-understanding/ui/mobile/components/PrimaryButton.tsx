import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  mode?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, mode = 'contained', disabled }: Props) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
      contentStyle={styles.content}
      labelStyle={styles.label}
      buttonColor={mode === 'contained' ? sieColors.accent : undefined}
      textColor={mode === 'contained' ? '#ffffff' : sieColors.accentStrong}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
  },
  content: {
    minHeight: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
