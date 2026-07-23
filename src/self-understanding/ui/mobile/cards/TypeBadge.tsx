import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  typeLabel: string;
  wingCode: string;
};

export function TypeBadge({ typeLabel, wingCode }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>タイプ名：{wingCode}</Text>
      <Text style={styles.sub}>{typeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: sieColors.surfaceSoft,
    borderColor: sieColors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: sieColors.accentStrong,
    fontWeight: '700',
    fontSize: 15,
  },
  sub: {
    color: sieColors.muted,
    fontWeight: '500',
    fontSize: 13,
  },
});
