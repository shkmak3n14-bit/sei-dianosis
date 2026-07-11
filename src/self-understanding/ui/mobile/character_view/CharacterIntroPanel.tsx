import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CharacterAvatar } from './CharacterAvatar';
import { sieColors } from '../theme';

type Props = {
  name: string;
  message: string;
};

export function CharacterIntroPanel({ name, message }: Props) {
  return (
    <View style={styles.wrap}>
      <CharacterAvatar name={name} size={96} />
      <Text variant="titleLarge" style={styles.name}>
        {name}
      </Text>
      <View style={styles.bubble}>
        <Text style={styles.message}>{message}</Text>
      </View>
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
  bubble: {
    backgroundColor: sieColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: sieColors.border,
    padding: 16,
    width: '100%',
  },
  message: {
    color: sieColors.text,
    lineHeight: 24,
    fontSize: 15,
  },
});
