import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { sieColors } from '../theme';

type Props = {
  onSend: (text: string) => void;
};

export default function InputBox({ onSend }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="気になることを書いてみてください"
        placeholderTextColor={sieColors.muted}
        multiline
      />
      <Pressable
        style={[styles.button, !text.trim() && styles.buttonDisabled]}
        onPress={handleSend}
        disabled={!text.trim()}
      >
        <Text style={styles.buttonLabel}>送信</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: sieColors.border,
    backgroundColor: sieColors.surfaceSoft,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: sieColors.surface,
    borderWidth: 1,
    borderColor: sieColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: sieColors.text,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: sieColors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
