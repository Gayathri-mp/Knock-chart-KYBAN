import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Trophy, Zap } from 'lucide-react-native';

interface TournamentSetupProps {
  onStart: (n: number) => void;
  error: string | null;
}

const QUICK_OPTIONS = [4, 8, 16, 32];

export const TournamentSetup = ({ onStart, error }: TournamentSetupProps) => {
  const [selected, setSelected] = useState<number>(8);
  const [custom, setCustom] = useState<string>('8');

  const handleQuickSelect = (n: number) => {
    setSelected(n);
    setCustom(String(n));
  };

  const handleGo = () => {
    const n = parseInt(custom, 10);
    if (!isNaN(n)) onStart(n);
  };

  const handleCustomChange = (val: string) => {
    setCustom(val);
    const n = parseInt(val, 10);
    if (QUICK_OPTIONS.includes(n)) setSelected(n);
    else setSelected(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>

          {/* Trophy Icon */}
          <View style={styles.iconWrapper}>
            <Trophy size={36} color="#00E676" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Tournament Bracket</Text>
          <Text style={styles.subtitle}>Create a knockout bracket for your competition</Text>

          {/* Card */}
          <View style={styles.card}>

            {/* Quick select */}
            <Text style={styles.cardLabel}>Quick select</Text>
            <View style={styles.quickRow}>
              {QUICK_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.quickBtn, selected === n && styles.quickBtnActive]}
                  onPress={() => handleQuickSelect(n)}
                >
                  <Text style={[styles.quickBtnText, selected === n && styles.quickBtnTextActive]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or enter custom</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Input + Go */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={custom}
                onChangeText={handleCustomChange}
                keyboardType="numeric"
                placeholder="e.g. 8"
                placeholderTextColor="#4A5568"
                onSubmitEditing={handleGo}
                returnKeyType="go"
              />
              <TouchableOpacity style={styles.goBtn} onPress={handleGo}>
                <Zap size={16} color="#0A0D10" fill="#0A0D10" />
                <Text style={styles.goBtnText}>Go</Text>
              </TouchableOpacity>
            </View>

            {/* Error */}
            {error && <Text style={styles.error}>{error}</Text>}
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D10',
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  /* Icon */
  iconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: '#0D1F16',
    borderWidth: 1,
    borderColor: '#00E67633',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#00E676',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },

  /* Title */
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },

  /* Card */
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0F1520',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2738',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardLabel: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '600',
    marginBottom: 14,
  },

  /* Quick select */
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  quickBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#161D2B',
    borderWidth: 1.5,
    borderColor: '#1E2738',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnActive: {
    borderColor: '#00E676',
    backgroundColor: '#0D1F16',
  },
  quickBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C8D6E5',
  },
  quickBtnTextActive: {
    color: '#00E676',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E2738',
  },
  dividerText: {
    fontSize: 12,
    color: '#4A5568',
  },

  /* Input row */
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: '#161D2B',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1E2738',
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  goBtn: {
    height: 52,
    paddingHorizontal: 22,
    backgroundColor: '#00E676',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#00E676',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  goBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0D10',
  },

  /* Error */
  error: {
    marginTop: 14,
    fontSize: 13,
    color: '#FF4D4D',
    textAlign: 'center',
    fontWeight: '500',
  },
});
