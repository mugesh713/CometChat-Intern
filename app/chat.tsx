import { CometChat } from '@cometchat/chat-sdk-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ChatScreen() {
  const { uid, name, avatar } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Get current user
    CometChat.getLoggedinUser().then(
      (user: any) => {
        setCurrentUser(user);
      },
      (error: any) => {
        console.log('Current user fetching failed with error:', error);
      }
    );

    // Fetch previous messages
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(uid as string)
      .setLimit(50)
      .build();

    messagesRequest.fetchPrevious().then(
      (messages: any) => {
        console.log('Message list fetched:', messages);
        setMessages(messages);
        setLoading(false);
      },
      (error: any) => {
        console.log('Message fetching failed with error:', error);
        setLoading(false);
      }
    );

    // Add message listener
    const listenerID = "CHAT_SCREEN_MESSAGE_LISTENER";
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message: any) => {
          console.log("Text message received:", message);
          if (message.sender.uid === uid) {
            setMessages(prevMessages => [...prevMessages, message]);
          }
        },
      })
    );

    // Clean up
    return () => {
      CometChat.removeMessageListener(listenerID);
    };
  }, [uid]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    setSending(true);
    const receiverID = uid as string;
    const messageText = inputText;
    const receiverType = CometChat.RECEIVER_TYPE.USER;
    const textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    );

    CometChat.sendMessage(textMessage).then(
      (message: any) => {
        console.log('Message sent successfully:', message);
        setMessages(prevMessages => [...prevMessages, message]);
        setInputText('');
        setSending(false);
      },
      (error: any) => {
        console.log('Message sending failed with error:', error);
        setSending(false);
      }
    );
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <ThemedView style={styles.headerTitleContainer}>
              <Image 
                source={{ uri: avatar as string || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                style={styles.headerAvatar}
              />
              <ThemedText type="defaultSemiBold">{name}</ThemedText>
            </ThemedView>
          ),
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ThemedView style={styles.containerStyle}>
          {messages.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No messages yet</ThemedText>
              <ThemedText style={styles.emptySubText}>
                Send a message to start the conversation
              </ThemedText>
            </ThemedView>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => {
                const isSender = item.sender.uid === currentUser?.uid;
                
                return (
                  <ThemedView 
                    style={[
                      styles.messageContainer, 
                      isSender ? styles.sentMessage : styles.receivedMessage
                    ]}
                  >
                    <ThemedView 
                      style={[
                        styles.messageBubble,
                        isSender ? styles.sentBubble : styles.receivedBubble
                      ]}
                    >
                      <ThemedText style={[
                        styles.messageText,
                        isSender ? { color: '#fff' } : {}
                      ]}>
                        {item.text}
                      </ThemedText>
                      <ThemedText style={[
                        styles.timeText,
                        isSender ? { color: '#fff' } : {}
                      ]}>
                        {formatTime(item.sentAt)}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                );
              }}
            />
          )}
          
          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={sendMessage}
              disabled={sending || !inputText.trim()}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  receivedMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: '#0a7ea4',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0a7ea4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
