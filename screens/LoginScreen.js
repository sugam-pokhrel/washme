import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInAnonymous, signInWithGoogleIdToken } from '../firebase/config';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation, onAuthChange }) {
  // Configure your client IDs below or use env vars.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: '<YOUR_EXPO_GOOGLE_CLIENT_ID>',
    iosClientId: '<YOUR_IOS_CLIENT_ID>',
    androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
    webClientId: '<YOUR_WEB_CLIENT_ID>',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        signInWithGoogleIdToken(id_token)
          .then(() => {
            console.log('Signed in with Google');
          })
          .catch((err) => {
            console.error('Firebase Google sign-in failed', err);
            Alert.alert('Sign-in failed', err.message || String(err));
          });
      }
    }
  }, [response]);

  const handleAnonymous = async () => {
    try {
      await signInAnonymous();
    } catch (err) {
      console.error('Anonymous sign-in failed', err);
      Alert.alert('Sign-in failed', err.message || String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Wash Connect</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4285F4' }]}
        onPress={() => {
          promptAsync();
        }}
        disabled={!request}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={handleAnonymous}>
        <Text style={styles.buttonText}>Sign in Anonymously (testing)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.secondary]} onPress={handleAnonymous}>
        <Text style={styles.linkText}>Browse laundries without signing in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24 },
  button: { width: '100%', paddingVertical: 14, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  secondary: { marginTop: 12 },
  linkText: { color: '#0066cc' },
});
