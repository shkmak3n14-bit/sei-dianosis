import { StyleSheet, View } from 'react-native';
import type { ChatChoice } from '../mocks/chatTypes';
import { TopicChoiceButton } from '../components/TopicChoiceButton';

type Props = {
  choices: ChatChoice[];
  onSelect: (choice: ChatChoice) => void;
  disabled?: boolean;
};

/** はい / いいえ / どちらとも言えない などの選択バー */
export function ChatChoiceBar({ choices, onSelect, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      {choices.map((choice) => (
        <View key={choice.id} style={styles.item}>
          <TopicChoiceButton
            label={choice.label}
            onPress={() => {
              if (!disabled) {
                onSelect(choice);
              }
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  item: {
    width: '100%',
  },
});
