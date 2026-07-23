import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  title: string;
  bullets: string[];
};

/** 深掘りカード（タイトル＋箇条書きの分割表示） */
export function DeepDiveCardView({ title, bullets }: Props) {
  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>
        <View style={styles.bullets}>
          {bullets.map((line) => (
            <View key={line} style={styles.row}>
              <Text style={styles.bullet}>・</Text>
              <Text style={styles.body}>{line}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: sieColors.surface,
    borderRadius: 16,
    borderColor: sieColors.border,
  },
  content: {
    gap: 10,
    paddingVertical: 4,
  },
  title: {
    color: sieColors.accentStrong,
    fontWeight: '700',
  },
  bullets: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 2,
  },
  bullet: {
    color: sieColors.accent,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    color: sieColors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
