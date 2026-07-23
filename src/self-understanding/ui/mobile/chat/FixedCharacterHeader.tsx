import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CharacterAvatar } from '../character_view/CharacterAvatar';
import { sieColors } from '../theme';

type Props = {
  name: string;
};

/** 画面上部に固定するキャラアイコン */
export function FixedCharacterHeader({ name }: Props) {
  return (
    <View style={styles.header}>
      <CharacterAvatar name={name} size={52} />
      <View style={styles.meta}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>自己理解チャット</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: sieColors.surfaceSoft,
    borderBottomWidth: 1,
    borderBottomColor: sieColors.border,
  },
  meta: {
    gap: 2,
  },
  name: {
    color: sieColors.accentStrong,
    fontWeight: '700',
    fontSize: 16,
  },
  sub: {
    color: sieColors.muted,
    fontSize: 12,
  },
});
