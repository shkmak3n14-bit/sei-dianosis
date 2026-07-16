import { useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterPromptHeader } from '../character_view/CharacterPromptHeader';
import { ScreenContainer } from '../components/ScreenContainer';
import { findUnderstandingItem } from '../data/understandingCheck9w8';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'AskSaiTemplates'>;

/**
 * ③ サイに質問する画面
 * 項目選択直後に質問テンプレートを 3〜5 個表示する
 */
export function AskSaiTemplatesScreen({ navigation, route }: Props) {
  const item = findUnderstandingItem(route.params.categoryId, route.params.itemId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'サイに質問する',
    });
  }, [navigation]);

  if (!item) {
    return (
      <ScreenContainer>
        <Text style={styles.empty}>項目が見つかりませんでした。</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <CharacterPromptHeader
        name="サイ"
        bubbleText={`${item.label} について、どう聞いてみる？`}
      />

      <Text style={styles.lead}>聞き方のテンプレートを選んでください</Text>

      <View style={styles.list}>
        {item.questionTemplates.map((template) => (
          <Pressable
            key={template.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate('Chat', { templateText: template.text })}
          >
            <Text style={styles.cardLabel}>{template.label}</Text>
            <Text style={styles.cardText}>{template.text}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    color: sieColors.muted,
    fontWeight: '600',
  },
  list: {
    gap: 10,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: sieColors.border,
    backgroundColor: sieColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: sieColors.accentStrong,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 24,
    color: sieColors.text,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: sieColors.muted,
  },
});
