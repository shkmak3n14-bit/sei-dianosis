// VoiceRecordButton.tsx
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import { sieColors } from '../theme';

type Props = {
  /** 録音完了後に URI を渡す（STT / respondVoiceInput へ） */
  onRecorded: (uri: string) => void | Promise<void>;
  disabled?: boolean;
};

/**
 * 録音開始 / 停止ボタン。
 * 停止後にローカル URI を onRecorded へ渡す。
 */
export function VoiceRecordButton({ onRecorded, disabled = false }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [busy, setBusy] = useState(false);

  async function startRecording() {
    if (disabled || busy) {
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
    } catch {
      setRecording(null);
    }
  }

  async function stopRecording() {
    if (!recording || busy) {
      return;
    }

    setBusy(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        await onRecorded(uri);
      }
    } catch {
      setRecording(null);
    } finally {
      setBusy(false);
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    }
  }

  const isRecording = recording !== null;
  const label = busy ? '処理中…' : isRecording ? '停止' : '録音';

  return (
    <Pressable
      style={[
        styles.button,
        isRecording && styles.buttonRecording,
        (disabled || busy) && styles.buttonDisabled,
      ]}
      onPress={isRecording ? stopRecording : startRecording}
      disabled={disabled || busy}
    >
      {busy ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text style={styles.buttonLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: sieColors.accentStrong,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    minWidth: 64,
    alignItems: 'center',
  },
  buttonRecording: {
    backgroundColor: '#b42318',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
