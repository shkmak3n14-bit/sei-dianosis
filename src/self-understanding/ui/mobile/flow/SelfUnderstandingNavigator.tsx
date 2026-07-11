import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CharacterIntroScreen } from '../screens/CharacterIntroScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { DeepDiveCardsScreen } from '../screens/DeepDiveCardsScreen';
import { ResultCardsScreen } from '../screens/ResultCardsScreen';
import { UnderstandingCheckScreen } from '../screens/UnderstandingCheckScreen';
import { sieColors } from '../theme';
import type { SelfUnderstandingStackParamList } from './types';

const Stack = createNativeStackNavigator<SelfUnderstandingStackParamList>();

/** 自己理解モジュールの画面フロー（4画面＋1チャット） */
export function SelfUnderstandingNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ResultCards"
        screenOptions={{
          headerStyle: { backgroundColor: sieColors.bg },
          headerTintColor: sieColors.accentStrong,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: sieColors.bg },
        }}
      >
        <Stack.Screen
          name="ResultCards"
          component={ResultCardsScreen}
          options={{ title: '診断結果' }}
        />
        <Stack.Screen
          name="CharacterIntro"
          component={CharacterIntroScreen}
          options={{ title: 'サイ登場' }}
        />
        <Stack.Screen
          name="UnderstandingCheck"
          component={UnderstandingCheckScreen}
          options={{ title: '理解度チェック' }}
        />
        <Stack.Screen
          name="DeepDiveCards"
          component={DeepDiveCardsScreen}
          options={{ title: '深掘りカード' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'サイと話す' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
