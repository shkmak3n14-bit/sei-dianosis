import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RadioButton, Text } from 'react-native-paper';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import type { SelfUnderstandingStackParamList } from '../flow/types';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';
import { sieColors } from '../theme';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'UnderstandingCheck'>;

/** 3. 理解度チェック画面（選択式） */
export function UnderstandingCheckScreen({ navigation }: Props) {
  const { understandingQuestion, understandingOptions } = selfUnderstandingMock;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ScreenContainer>
      <Text variant="titleMedium" style={styles.title}>
        {understandingQuestion}
      </Text>

      <RadioButton.Group
        onValueChange={setSelectedId}
        value={selectedId ?? ''}
      >
        <View style={styles.options}>
          {understandingOptions.map((option) => (
            <View key={option.id} style={styles.optionRow}>
              <RadioButton.Item
                label={option.label}
                value={option.id}
                color={sieColors.accent}
                labelStyle={styles.optionLabel}
                style={styles.optionItem}
              />
            </View>
          ))}
        </View>
      </RadioButton.Group>

      <PrimaryButton
        label="深掘りカードへ"
        disabled={!selectedId}
        onPress={() => navigation.navigate('DeepDiveCards')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: sieColors.text,
    fontWeight: '700',
    lineHeight: 26,
  },
  options: {
    gap: 8,
  },
  optionRow: {
    backgroundColor: sieColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: sieColors.border,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 4,
  },
  optionLabel: {
    color: sieColors.text,
    fontSize: 15,
  },
});
