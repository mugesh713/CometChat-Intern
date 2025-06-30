import { CometChat } from '@cometchat/chat-sdk-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SAMPLE_USERS } from '@/constants/CometChatConfig';

export default function ContactsScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the users list
    const limit = 30;
    const usersRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();
    
    usersRequest.fetchNext().then(
      (userList: any) => {
        console.log('User list fetched successfully:', userList);
        // If no users are returned, use sample users
        if (userList && userList.length > 0) {
          setUsers(userList);
        } else {
          setUsers(SAMPLE_USERS);
        }
        setLoading(false);
      },
      (error: any) => {
        console.log('User list fetching failed with error:', error);
        // Fallback to sample users if there's an error
        setUsers(SAMPLE_USERS);
        setLoading(false);
      }
    );
  }, []);

  const startChat = (user: any) => {
    router.push({
      pathname: '/chat',
      params: { 
        uid: user.uid,
        name: user.name,
        avatar: user.avatar || ''
      }
    });
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
        <ThemedText type="title">Contacts</ThemedText>
      </ThemedView>
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem}
            onPress={() => startChat(item)}
          >
            <Image 
              source={{ uri: item.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
              style={styles.avatar}
            />
            <ThemedView style={styles.userInfo}>
              <ThemedText type="defaultSemiBold">{item.name || item.uid}</ThemedText>
              <ThemedText style={styles.statusText}>
                {item.status === 'online' ? 'Online' : 'Tap to chat'}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
      />
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
  userItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
});
