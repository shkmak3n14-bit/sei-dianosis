import { useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TopicChoiceButton } from '../components/TopicChoiceButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { findUnderstandingCategory } from '../data/understandingCheck9w8';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'CategoryItems'>;

/**
 * ② カテゴリ項目一覧画面
 * 項目を押すと AskSaiTemplates へ遷移する
 */
export function CategoryItemsScreen({ navigation, route }: Props) {
  const category = findUnderstandingCategory(route.params.categoryId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: category?.title ?? '項目一覧',
    });
  }, [category?.title, navigation]);

  if (!category) {
    return (
      <ScreenContainer>
        <Text style={styles.empty}>カテゴリが見つかりませんでした。</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Text style={styles.lead}>知りたい項目を選んでください</Text>

      <View style={styles.list}>
        {category.items.map((item) => (
          <TopicChoiceButton
            key={item.id}
            label={item.label}
            body={item.body}
            onPress={() =>
              navigation.navigate('AskSaiTemplates', {
                categoryId: category.id,
                itemId: item.id,
              })
            }
          />
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
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: sieColors.muted,
  },
});
