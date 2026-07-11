import { StyleSheet, View } from 'react-native';
import type { UnderstandingOption } from '../mocks/types';
import { TopicChoiceButton } from './TopicChoiceButton';

type Props = {
  options: UnderstandingOption[];
  selectedId: string | null;
  onSelect: (optionId: string) => void;
};

/** 理解度チェックの選択肢一覧 */
export function TopicChoiceList({ options, selectedId, onSelect }: Props) {
  return (
    <View style={styles.list}>
      {options.map((option) => (
        <TopicChoiceButton
          key={option.id}
          label={option.label}
          selected={selectedId === option.id}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
});
