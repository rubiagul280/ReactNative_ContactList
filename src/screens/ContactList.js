/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const requestContactPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
            buttonNeutral: 'Ask Me Later',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchContacts();
        } else {
          console.log('Contacts permission denied');
        }
      } catch (error) {
        console.log(error);
      }
    };
    requestContactPermission();
  }, []);

  const fetchContacts = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app needs access to your contacts.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const allContacts = await Contacts.getAll();
        const sortedContacts = allContacts
          .filter((contact) => /^[A-Za-z]+$/.test(contact.givenName))
          .sort((a, b) => a.givenName.localeCompare(b.givenName));
        setContacts(sortedContacts);

        const alphabetList = [];
        sortedContacts.forEach((contact) => {
          const firstLetter = contact.givenName[0].toUpperCase();
          if (!alphabetList.includes(firstLetter)) {
            alphabetList.push(firstLetter);
          }
        });
        setAlphabet(alphabetList);
      } else {
        console.log('Contacts permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToLetter = (letter) => {
    const index = contacts.findIndex(
      (contact) =>
        contact.givenName[0].toUpperCase() === letter.toUpperCase()
    );
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ index });
      setSelectedAlphabet(letter);
    }
    else {
      // Alert when the letter is not found
      Alert.alert('No contacts found', `No contacts found for letter ${letter}`, [
        { text: 'OK', onPress: () => {} },
      ]);
    }
    
  };

  const renderItem = ({ item, index }) => {
    const uniquePhoneNumbers = [
      ...new Set(item.phoneNumbers.map((phoneNumber) => phoneNumber.number)),
    ];
    const formattedPhoneNumber = formatPhoneNumber(uniquePhoneNumbers[0]);

    const isDifferentAlphabet =
      index === 0 ||
      item.givenName[0].toUpperCase() !==
        contacts[index - 1].givenName[0].toUpperCase();
    const isLastItem =
      index === contacts.length - 1 ||
      contacts[index + 1].givenName[0].toUpperCase() !==
        item.givenName[0].toUpperCase();

    // Check if the contact is in the list
    const isInList = contacts.some((contact) => contact.recordID === item.recordID);

    const nameColor = isInList ? '#000' : 'gray';
    const phoneNumberColor = isInList ? '#848484' : 'gray';

    return (
      <>
        {isDifferentAlphabet && (
          <View style={{ padding: 15 }}>
            <Text style={{ fontFamily: 'Lato', fontSize: 18, color: '#000' }}>
              {item.givenName[0].toUpperCase()}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={() => console.log(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              justifyContent: 'space-around',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10 }}
            >
              <Text
                style={{
                  fontFamily: 'Lato',
                  fontSize: 14,
                  color: nameColor,
                  marginRight: 10,
                  width: 90,
                }}
              >
                {item.givenName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato',
                  fontSize: 14,
                  color: phoneNumberColor,
                  maxWidth: Dimensions.get('window').width * 0.4,
                }}
              >
                + {formattedPhoneNumber}
              </Text>
            </View>
            {isLastItem && <View style={{ height: 1.5, backgroundColor: 'gray' }} />}
            <Image
              source={
                item.hasThumbnail
                  ? { uri: item.thumbnailPath }
                  : require('../../assets/invite.png')
              }
              style={{ width: 60, height: 20, marginRight: 15 }}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return '';
    }
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const formattedNumber = digitsOnly.replace(/(\d{2})(\d{3})(\d+)/, '$1 $2 $3');
    return formattedNumber;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topbar}>
        <Image source={require('../../assets/back-arrow.png')} style={{ width: 32, height: 32, marginRight: 70 }} />
        <Image source={require('../../assets/logo.png')} style={{ width: 80, height: 20, marginRight: 70 }} />
        <Image source={require('../../assets/shop.png')} style={{ width: 20, height: 25 }} />
      </View>

      {/* Divider line */}
      <View style={styles.divider} />

      <View style={styles.header}>
        <Text style={styles.contactlength}>{contacts.length || 0} Contacts</Text>
        <Text style={styles.title}>CONTACTS</Text>
        <Image source={require('../../assets/users.png')} style={{ width: 27, height: 22 }} />
      </View>

      {/* User */}
      <View style={styles.userdata}>
        <Image source={require('../../assets/avatar.png')} style={{ width: 50, height: 50, marginRight: 16 }} />
        <Text style={{ flex: 1, fontSize: 20, fontFamily: 'Lato', color: '#000' }}>Edin Adam</Text>
        <Image source={require('../../assets/plus.png')} style={{ width: 20, height: 20 }} />
      </View>

      {/* Divider line */}
      <View style={styles.divider} />

      {/* Contact list */}
      <FlatList
        ref={flatListRef}
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

      {/* Alphabet list */}
      <View
        style={{
          position: 'absolute',
          top: 70,
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: 10,
          height: '100%',
        }}
      >
        {alphabet.map((letter) => {
          const isLetterInList = contacts.some(
            (contact) =>
              contact.givenName[0].toUpperCase() === letter.toUpperCase()
          );
          const alphabetColor = isLetterInList ? 'black' : 'gray';

          return (
            <TouchableOpacity key={letter} onPress={() => scrollToLetter(letter)}>
              <Text
                style={{
                  fontSize: 13,
                  color: selectedAlphabet === letter ? '#BE9F56' : alphabetColor,
                  paddingVertical: 1,
                  textAlign: 'right',
                }}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View>
        <Image source={require('../../assets/add_contact.png')} style={{ width: Dimensions.get('window').width, height: 40 }} />
      </View>
    </View>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#BE9F56',
    margin: 5,
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contactlength: {
    fontSize: 12,
    fontFamily: 'Lato',
    marginTop: 4,
    marginRight: 40,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Lato',
    fontWeight: 'normal',
    color: '#000',
    marginRight: 70,
  },
  userdata: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});
