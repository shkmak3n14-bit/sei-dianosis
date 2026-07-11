import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  name: string;
  size?: number;
};

/** 簡易アバター（画像差し替え前提のプレースホルダ） */
export function CharacterAvatar({ name, size = 56 }: Props) {
  const initial = name.slice(0, 1);

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: sieColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: sieColors.border,
  },
  initial: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
