import { StyleSheet, Text, View } from 'react-native';
import type { EnneaCardSection } from '../data/enneaCard9w8';
import { sieColors } from '../theme';

type Props = {
  sections: EnneaCardSection[];
};

/** スマホ向け診断カード（9w8）。sections は JSON フィールド id/title/icon/body を維持。 */
export function EnneaCard9w8({ sections }: Props) {
  return (
    <View style={styles.wrap}>
      {sections.map((section) => (
        <View key={section.id} style={styles.card}>
          <Text style={styles.title}>
            {section.icon} {section.title}
          </Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    gap: 12,
  },
  card: {
    backgroundColor: sieColors.surface,
    borderWidth: 1,
    borderColor: sieColors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  title: {
    marginBottom: 10,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: sieColors.accentStrong,
  },
  body: {
    fontSize: 15,
    lineHeight: 26,
    color: sieColors.text,
  },
});
