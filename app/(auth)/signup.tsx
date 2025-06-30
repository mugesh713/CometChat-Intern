import { CometChat } from '@cometchat/chat-sdk-react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { COMETCHAT_CONSTANTS } from '@/constants/CometChatConfig';

export default function SignupScreen() {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!uid.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Create a new user with the new SDK
      const user = new CometChat.User(uid, name);
      
      const createdUser = await CometChat.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY);
      console.log('User created successfully:', createdUser);
      
      // Login after successful signup - fix the login call
      try {
        // Fix: directly pass the uid and authKey as separate parameters
        const loggedInUser = await CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY);
        
        console.log('Login Successful:', loggedInUser);
        setLoading(false);
        router.replace('/(tabs)');
      } catch (loginError: any) {
        console.log('Login failed with error:', loginError);
        Alert.alert(
          'Login Error', 
          'User created but login failed. Please try logging in manually.',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/login') 
            }
          ]
        );
        setLoading(false);
      }
    } catch (error: any) {
      console.log('User creation failed with error:', error);
      
      // Check for duplicate user error
      if (error.code === 'ERR_UID_ALREADY_EXISTS') {
        Alert.alert(
          'Signup Error', 
          'This User ID already exists. Please try logging in instead.',
          [
            { 
              text: 'Go to Login', 
              onPress: () => router.push('/login') 
            },
            {
              text: 'Try Again',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Signup Error', error.message || 'Failed to create user');
      }
      
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
      <ThemedText style={styles.subtitle}>Join CometChat</ThemedText>
      
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          placeholderTextColor="#888"
          value={uid}
          onChangeText={setUid}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/login')}>
          <ThemedText style={styles.linkText}>
            Already have an account? Login
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
});
 
