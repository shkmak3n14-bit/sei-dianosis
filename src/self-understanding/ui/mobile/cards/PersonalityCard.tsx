import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import type { PersonalityHighlight } from '../mocks/types';
import { sieColors } from '../theme';

type Props = {
  title: string;
  highlights: PersonalityHighlight[];
};

export function PersonalityCard({ title, highlights }: Props) {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        {highlights.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.bullet}>・</Text>
            <View style={styles.rowBody}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: sieColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: sieColors.border,
  },
  content: {
    gap: 14,
    paddingVertical: 8,
  },
  title: {
    color: sieColors.text,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 2,
  },
  bullet: {
    color: sieColors.accent,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: sieColors.accentStrong,
    fontWeight: '700',
    fontSize: 14,
  },
  body: {
    color: sieColors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
