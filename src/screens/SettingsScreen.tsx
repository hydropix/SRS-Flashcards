import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { importBuiltinDecks } from '../data/builtinDecks';
import { resetDatabase, initDatabase } from '../storage/database';

interface SettingsScreenProps {
  navigation: any;
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [importing, setImporting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleImportDecks = async () => {
    Alert.alert(
      'Importer les decks du Brevet',
      'Cela va ajouter tous les decks et cartes pour les matières du brevet. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Importer',
          onPress: async () => {
            try {
              setImporting(true);
              await initDatabase();
              await importBuiltinDecks();
              Alert.alert('Succès', 'Les decks du brevet ont été importés !');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'importer les decks');
              console.error(error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleResetData = async () => {
    Alert.alert(
      'Réinitialiser toutes les données',
      'Cette action est irréversible ! Toutes vos cartes et progressions seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              setResetting(true);
              await resetDatabase();
              Alert.alert('Succès', 'Toutes les données ont été supprimées');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser');
            } finally {
              setResetting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Données</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleImportDecks}
          disabled={importing}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="download" size={24} color="#6366f1" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>
              {importing ? 'Importation...' : 'Importer les decks du Brevet'}
            </Text>
            <Text style={styles.buttonSubtitle}>
              Ajoute les cartes pour toutes les matières
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]}
          onPress={handleResetData}
          disabled={resetting}
        >
          <View style={[styles.iconContainer, styles.dangerIconContainer]}>
            <MaterialCommunityIcons name="trash-can" size={24} color="#ef4444" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={[styles.buttonTitle, styles.dangerText]}>
              {resetting ? 'Suppression...' : 'Réinitialiser toutes les données'}
            </Text>
            <Text style={styles.buttonSubtitle}>
              Supprime tout (irréversible)
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>DNB FlashCards</Text>
          <Text style={styles.infoText}>
            Application de révision basée sur la répétition espacée (algorithme SM-2).
          </Text>
          <Text style={styles.infoText}>
            Optimisée pour le Brevet des Collèges avec +100 cartes sur toutes les matières.
          </Text>
        </View>

        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>Conseils d'utilisation</Text>
          <Text style={styles.tipItem}>• Révisez tous les jours, même 5 minutes</Text>
          <Text style={styles.tipItem}>• Soyez honnête avec vous-même sur les réponses</Text>
          <Text style={styles.tipItem}>• "À revoir" = vous ne saviez pas la réponse</Text>
          <Text style={styles.tipItem}>• "Facile" = réponse immédiate, parfaite</Text>
        </View>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
  },
  header: {
    backgroundColor: '#e0e5ec',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  section: {
    backgroundColor: '#e0e5ec',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e5ec',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  dangerButton: {
    shadowColor: '#f87171',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#e0e5ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  dangerIconContainer: {
    shadowColor: '#fecaca',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  buttonSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  dangerText: {
    color: '#ef4444',
  },
  infoBox: {
    backgroundColor: '#e0e5ec',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 8,
  },
  tipsBox: {
    backgroundColor: '#e0e5ec',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 24,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    marginTop: 20,
  },
  bottomPadding: {
    height: 40,
  },
});
