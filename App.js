import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Text,SafeAreaView } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import * as Contacts from 'expo-contacts';

const Item = ({ number }) => (
  <View style={styles.item}>
    <Text style={styles.phone}>{number}</Text>
  </View>
);

export default function App() {

  const [contactsInMemory, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setLoading(false);
          const sortedContacts = data.filter(c => c.phoneNumbers!== undefined).sort((a, b) => a.firstName - b.firstName);
          setContacts(sortedContacts);
          console.log(sortedContacts.length);
        }
      }
    })();
  }, []);

  const renderItem = ({ item }) => <Item number={item.phoneNumbers[0].number} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{
        textAlign:'center', 
        marginVertical: 20,
        fontStyle:'italic'
        }}>Loaded Contacts: {contactsInMemory.length}
      </Text>
      {
        !loading?
        (
         <FlatList data={contactsInMemory} renderItem={renderItem} keyExtractor={item => item.id} />
         
        ):
        (
          <>
            <Text style={{
              textAlign:'center', 
              fontSize: 20,
              marginVertical: 20,
            }}>Loading your contacts</Text>

           <Text style={{
              textAlign:'center', 
              marginVertical: 20,
              fontStyle:'italic'
            }}>Kindly wait, this normally takes few seconds</Text>
          <ActivityIndicator animating={loading} color={Colors.red800} />
          </>
        )
      }
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  phone: {
    fontSize: 32,
  },

});