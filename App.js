import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState('');
  const [savedContact, setSavedContact] = useState(null);

  const saveContact = () => {
    if (contact.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number!');
      return;
    }
    setSavedContact(contact);
    Alert.alert('Success', `Contact ${contact} saved!`);
  };

  const sendSOS = async () => {
    if (!savedContact) {
      Alert.alert('No Contact', 'Please save an emergency contact first!');
      return;
    }

    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow location permission to use SOS!');
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        [savedContact],
        `🚨 EMERGENCY ALERT! 🚨\nI need help!\nMy location:\nhttps://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`
      );
    } else {
      Alert.alert('SMS Not Available', 'SMS is not available on this device!');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Alert</Text>

      <View style={styles.contactBox}>
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
      </View>

      {savedContact && (
        <Text style={styles.savedText}>✅ Contact Saved: {savedContact}</Text>
      )}

      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>{loading ? '...' : 'SOS'}</Text>
      </TouchableOpacity>

      <Text style={styles.subText}>Press SOS to send emergency alert</Text>

      {location && (
        <Text style={styles.locationText}>
          Lat: {location.latitude.toFixed(4)}{'\n'}
          Lon: {location.longitude.toFixed(4)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 30,
  },
  contactBox: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 20,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginTop: 20,
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