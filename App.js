import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState('');
  const [contacts, setContacts] = useState([]);

  const saveContact = () => {
    if (contact.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number!');
      return;
    }
    setContacts([...contacts, contact]);
    setContact('');
    Alert.alert('Success', 'Contact saved!');
  };

  const sendSOS = async () => {
    if (contacts.length === 0) {
      Alert.alert('No Contacts', 'Please save an emergency contact first!');
      return;
    }
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow location permission!');
      setLoading(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        contacts,
        `🚨 EMERGENCY ALERT! 🚨\nI need help!\nMy location:\nhttps://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`
      );
    } else {
      Alert.alert('SMS Not Available', 'SMS is not supported!');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Emergency Alert</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter emergency contact number"
        keyboardType="phone-pad"
        value={contact}
        onChangeText={setContact}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
        <Text style={styles.saveText}>Save Contact</Text>
      </TouchableOpacity>

      {contacts.map((c, i) => (
        <Text key={i} style={styles.savedText}>✅ {c}</Text>
      ))}

      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>{loading ? '...' : 'SOS'}</Text>
      </TouchableOpacity>

      <Text style={styles.subText}>Press SOS to send emergency alert</Text>

      {location && (
        <Text style={styles.locationText}>
          📍 Lat: {location.latitude.toFixed(4)}{'\n'}
          Lon: {location.longitude.toFixed(4)}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 5,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginTop: 30,
  },
  sosText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  locationText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});