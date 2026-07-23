import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { PrimaryButton } from '../components/PrimaryButton';
import { sieColors } from '../theme';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterSpeechBubble } from './CharacterSpeechBubble';

type Props = {
  name: string;
  bubbleText: string;
  ctaLabel: string;
  onPressCta: () => void;
};

/**
 * キャラ登場ステージ。
 * 画面下半分からスライドインし、存在感を出す。
 */
export function CharacterSlideInStage({
  name,
  bubbleText,
  ctaLabel,
  onPressCta,
}: Props) {
  const { height } = useWindowDimensions();
  const panelHeight = Math.round(height * 0.52);
  const translateY = useSharedValue(panelHeight);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 620,
      easing: Easing.out(Easing.cubic),
    });
  }, [panelHeight, translateY]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.root}>
      <View style={styles.upperSpace} />

      <Animated.View style={[styles.panel, { height: panelHeight }, panelStyle]}>
        <View style={styles.handle} />

        <CharacterSpeechBubble text={bubbleText} />

        <View style={styles.characterBlock}>
          <CharacterAvatar name={name} size={120} />
          <Text style={styles.name}>{name}</Text>
        </View>

        <PrimaryButton label={ctaLabel} onPress={onPressCta} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: sieColors.bg,
  },
  upperSpace: {
    flex: 1,
  },
  panel: {
    backgroundColor: sieColors.surfaceSoft,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: sieColors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 16,
    justifyContent: 'space-between',
    // 影で「下から出てきた」感を強調
    shadowColor: '#0e5f3f',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: sieColors.border,
    marginBottom: 4,
  },
  characterBlock: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: sieColors.accentStrong,
    fontWeight: '700',
    fontSize: 18,
  },
});
