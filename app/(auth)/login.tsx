import { CometChat } from '@cometchat/chat-sdk-react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { COMETCHAT_CONSTANTS } from '@/constants/CometChatConfig';

export default function LoginScreen() {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!uid.trim()) {
      Alert.alert('Error', 'Please enter a valid User ID');
      return;
    }

    setLoading(true);
    
    try {
      // Fix: directly pass the uid and authKey as separate parameters
      const user = await CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY);
      
      console.log('Login Successful:', user);
      setLoading(false);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Login failed with error:', error);
      
      // Show more user-friendly error message
      const errorMessage = error.message || 'Failed to log in. Please check your credentials.';
      Alert.alert('Login Error', errorMessage);
      
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>CometChat</ThemedText>
      <ThemedText style={styles.subtitle}>Chat Application</ThemedText>
      
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter User ID (e.g. superhero1)"
          placeholderTextColor="#888"
          value={uid}
          onChangeText={setUid}
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <ThemedText style={styles.linkText}>
            Don&apos;t have an account? Sign up
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedText style={styles.helpText}>
        Use one of these test users: superhero1, superhero2, superhero3, superhero4
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 36,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    fontSize: 18,
    opacity: 0.7,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#0a7ea4',
    marginTop: 10,
  },
  helpText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    opacity: 0.7,
  },
});

