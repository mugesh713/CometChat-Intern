import { CometChat } from '@cometchat/chat-sdk-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the conversations list
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(30)
      .build();

    conversationsRequest.fetchNext().then(
      (conversationList: any) => {
        console.log('Conversations list fetched successfully', conversationList);
        setConversations(conversationList);
        setLoading(false);
      },
      (error: any) => {
        console.log('Conversations list fetching failed with error:', error);
        setLoading(false);
      }
    );
  }, []);

  const navigateToChat = (conversation: any) => {
    const user = conversation.conversationWith;
    router.push({
      pathname: '/chat',
      params: { 
        uid: user.uid,
        name: user.name,
        avatar: user.avatar || ''
      }
    });
  };

  // Format the last message time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp * 1000);
    const now = new Date();
    
    // Today's date
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // This week
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Older
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
   <SafeAreaView
    style={{ flex: 1 }}
   >

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Chats</ThemedText>
          <TouchableOpacity style={styles.newChatButton} onPress={() => router.push('/contacts')}>
            <Ionicons name="create-outline" size={24} color="#0a7ea4" />
          </TouchableOpacity>
        </ThemedView>
        
        {conversations.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={80} color="#ccc" />
            <ThemedText style={styles.emptyText}>No conversations yet</ThemedText>
            <ThemedText style={styles.emptySubText}>
              Start a chat with someone from your contacts
            </ThemedText>
            <TouchableOpacity 
              style={styles.newChatButtonLarge} 
              onPress={() => router.push('/contacts')}
            >
              <ThemedText style={styles.newChatButtonText}>New Chat</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.conversationId}
            renderItem={({ item }) => {
              const user = item.conversationWith;
              const lastMessage = item.lastMessage?.text || 'New conversation';
              
              return (
                <TouchableOpacity 
                  style={styles.conversationItem}
                  onPress={() => navigateToChat(item)}
                  >
                  <Image 
                    source={{ uri: user.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                    style={styles.avatar}
                    />
                  <ThemedView style={styles.conversationContent}>
                    <ThemedView style={styles.conversationHeader}>
                      <ThemedText type="defaultSemiBold" numberOfLines={1}>
                        {user.name || user.uid}
                      </ThemedText>
                      <ThemedText style={styles.timeText}>
                        {formatTime(item.lastMessage?.sentAt)}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText 
                      numberOfLines={1} 
                      style={styles.lastMessage}
                    >
                      {lastMessage}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              );
            }}
            />
          )}
      </ThemedView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  newChatButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  newChatButtonLarge: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  newChatButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.6,
  },
  lastMessage: {
    opacity: 0.7,
  },
});
