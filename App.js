import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import MyAccount from './screens/MyAccount';
import MyListings from './screens/MyListings';
import Laundries from './screens/Laundries';
import RentLaundry from './screens/RentLaundry';
import { initFirebase, onAuthStateChanged } from './firebase/config';

// Firebase web SDK config (from your Firebase console)
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBwgUs6Oavk-RmLltqOjLktaQthhtjiJZ8',
  authDomain: 'washconnect-9e642.firebaseapp.com',
  projectId: 'washconnect-9e642',
  storageBucket: 'washconnect-9e642.firebasestorage.app',
  messagingSenderId: '607752613612',
  appId: '1:607752613612:web:406988efa2e5ff0a887fc9',
  measurementId: 'G-JTK7BKQ91W',
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      // initialize firebase if config provided
      if (FIREBASE_CONFIG.apiKey) initFirebase(FIREBASE_CONFIG);
    } catch (err) {
      console.warn('Firebase init failed (placeholder config). Add real config to firebase/config.js', err);
    }

    let unsub;
    try {
      unsub = onAuthStateChanged((u) => {
        setUser(u);
        setInitializing(false);
      });
    } catch (err) {
      // If firebase not initialized we still let app render after a short wait
      console.warn('Auth listener not attached:', err);
      setInitializing(false);
    }

    return () => unsub && unsub();
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Signed in
          <>
            <Stack.Screen name="Laundries" component={Laundries} />
            <Stack.Screen name="MyListings" component={MyListings} />
            <Stack.Screen name="MyAccount" component={MyAccount} />
            <Stack.Screen name="RentLaundry" component={RentLaundry} />
          </>
        ) : (
          // Not signed in
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
