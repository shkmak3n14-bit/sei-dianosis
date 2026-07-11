import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  title: string;
  body: string;
};

export function DeepDiveCardView({ title, body }: Props) {
  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.body}>{body}</Text>
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
    gap: 8,
  },
  title: {
    color: sieColors.accentStrong,
    fontWeight: '700',
  },
  body: {
    color: sieColors.muted,
    lineHeight: 22,
  },
});
