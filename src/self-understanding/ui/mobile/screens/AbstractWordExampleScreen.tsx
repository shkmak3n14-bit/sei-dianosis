import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AbstractWordExampleFlow } from '../components/AbstractWordExampleFlow';
import { EXAMPLE_STORY_WEAKNESS } from '../data/exampleStoryWeakness';
import type { SelfUnderstandingStackParamList } from '../flow/types';

type Props = NativeStackScreenProps<SelfUnderstandingStackParamList, 'AbstractWordExample'>;

/** 抽象語の例え話 → 入力 → LLM 返答画面 */
export function AbstractWordExampleScreen({ route }: Props) {
  return (
    <AbstractWordExampleFlow
      template={EXAMPLE_STORY_WEAKNESS}
      userQuestion={route.params?.userQuestion}
    />
  );
}
