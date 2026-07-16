import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AbstractWordExampleScreen } from '../screens/AbstractWordExampleScreen';
import { AskSaiTemplatesScreen } from '../screens/AskSaiTemplatesScreen';
import { CategoryItemsScreen } from '../screens/CategoryItemsScreen';
import ChatScreen from '../chat/ChatScreen';
import { DeepDiveCardsScreen } from '../screens/DeepDiveCardsScreen';
import { ResultCardsScreen } from '../screens/ResultCardsScreen';
import { sieColors } from '../theme';
import type { SelfUnderstandingStackParamList } from './types';

const Stack = createNativeStackNavigator<SelfUnderstandingStackParamList>();

/** 自己理解モジュールの画面フロー */
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
          name="CategoryItems"
          component={CategoryItemsScreen}
          options={{ title: '項目一覧' }}
        />
        <Stack.Screen
          name="AskSaiTemplates"
          component={AskSaiTemplatesScreen}
          options={{ title: 'サイに質問する' }}
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
        <Stack.Screen
          name="AbstractWordExample"
          component={AbstractWordExampleScreen}
          options={{ title: '例え話' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
