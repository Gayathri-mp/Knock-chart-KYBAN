import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { X, UserMinus, Search } from 'lucide-react-native';
import { Team } from '../lib/tournament';

interface TeamSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  teams: Team[];
  onSelect: (team: Team) => void;
  onRemove?: () => void;
  currentTeam?: Team | null;
  title?: string;
}

export const TeamSelectionModal = ({
  visible,
  onClose,
  teams,
  onSelect,
  onRemove,
  currentTeam,
  title = "Select Team",
}: TeamSelectionModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{teams.length} available</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#868E96" />
            </TouchableOpacity>
          </View>

          {currentTeam && onRemove && (
            <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
              <UserMinus size={18} color="#FF4444" />
              <Text style={styles.removeButtonText}>Remove Current</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={teams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.teamItem}
                onPress={() => onSelect(item)}
              >
                <View style={[styles.logoContainer, { backgroundColor: item.color + '22' }]}>
                  <Text style={[styles.logoText, { color: item.color }]}>{item.logo}</Text>
                </View>
                <Text style={styles.teamName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>None available</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: '#1A1D23',
    borderRadius: 16,
    width: Math.min(width * 0.85, 320),
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: '#2A2F35',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F35',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#495057',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 12,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF4444',
  },
  listContent: {
    padding: 8,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 12,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoText: {
    fontSize: 16,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E9ECEF',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#495057',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
