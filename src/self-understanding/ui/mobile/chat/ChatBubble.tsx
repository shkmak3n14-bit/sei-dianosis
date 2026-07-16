import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { sieColors } from '../theme';

type Props = {
  text: string;
  /** 新チャットフロー用 */
  sender?: 'user' | 'sie';
  /** 既存リスト用（後方互換） */
  role?: 'character' | 'user';
};

export function ChatBubble({ sender, role, text }: Props) {
  const isUser = sender === 'user' || role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowCharacter]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.characterBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.characterText]}>{text}</Text>
      </View>
    </View>
  );
}

export default ChatBubble;

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: 10,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowCharacter: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  characterBubble: {
    backgroundColor: sieColors.surface,
    borderWidth: 1,
    borderColor: sieColors.border,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: sieColors.accent,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  characterText: {
    color: sieColors.text,
  },
  userText: {
    color: '#ffffff',
  },
});
