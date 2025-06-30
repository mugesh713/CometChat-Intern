import { CometChat } from '@cometchat/chat-sdk-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CometChat.getLoggedinUser().then(
      (user: any) => {
        console.log('User details:', user);
        setUser(user);
        setLoading(false);
      },
      (error: any) => {
        console.log('User details fetching failed with error:', error);
        setLoading(false);
      }
    );
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            try {
              const currentUser = await CometChat.getLoggedinUser();
              if (currentUser) {
                await CometChat.logout();
              }
              router.replace('/(auth)/login');
            } catch (error: any) {
              router.replace('/(auth)/login');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showAccountInfo = () => {
    Alert.alert(
      'Account Information',
      `Name: ${user?.name || 'N/A'}\nUID: ${user?.uid}\nStatus: ${user?.status || 'N/A'}`,
      [{ text: 'OK' }]
    );
  };

  const showNotificationsSettings = () => {
    Alert.alert(
      'Notifications',
      'Notification settings would be displayed here',
      [{ text: 'OK' }]
    );
  };

  const showPrivacySecurity = () => {
    Alert.alert(
      'Privacy & Security',
      'When You login please Enter the UID properly',
      [{ text: 'OK' }]
    );
  };

  const showHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'For support, please contact us at careers.intern@cometchat.com',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.profileContainer}>
        <Image 
          source={{ uri: user?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
          style={styles.avatar}
        />
        <ThemedText type="title" style={styles.userName}>
          {user?.name || user?.uid}
        </ThemedText>
        <ThemedText style={styles.userUid}>
          @{user?.uid}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.infoContainer}>
        <TouchableOpacity style={styles.infoRow} onPress={showAccountInfo}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <ThemedText style={styles.infoText}>Account Information</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoRow} onPress={showNotificationsSettings}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
          <ThemedText style={styles.infoText}>Notifications</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoRow} onPress={showPrivacySecurity}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" />
          <ThemedText style={styles.infoText}>Privacy & Security</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoRow} onPress={showHelpSupport}>
          <Ionicons name="help-circle-outline" size={24} color="#666" />
          <ThemedText style={styles.infoText}>Help & Support</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </ThemedView>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
      
      <ThemedText style={styles.versionText}>
        www.cometchat.com
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    marginBottom: 8,
  },
  userUid: {
    fontSize: 16,
    opacity: 0.6,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutText: {
    color: '#ff3b30',
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    fontSize: 14,
    opacity: 0.5,
  },
});