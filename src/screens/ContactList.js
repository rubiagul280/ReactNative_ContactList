/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
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
                const sortedContacts = allContacts.filter(contact => /^[A-Za-z]+$/.test(contact.givenName)).sort((a, b) => a.givenName.localeCompare(b.givenName));
                setContacts(sortedContacts);

                const alphabetList = [];
                sortedContacts.forEach(contact => {
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

    const scrollToLetter = letter => {
        const index = contacts.findIndex(contact => contact.givenName[0].toUpperCase() === letter);
        if (index !== -1) {
            flatListRef.current.scrollToIndex({ index });
        }
    };

    const renderItem = ({ item, index }) => {
        // Remove duplicates and format phone numbers
        const uniquePhoneNumbers = [...new Set(item.phoneNumbers.map(phoneNumber => phoneNumber.number))];
        const formattedPhoneNumbers = uniquePhoneNumbers.map(phoneNumber => formatPhoneNumber(phoneNumber));

        // Check if the current contact has a different alphabet than the previous contact
        const isDifferentAlphabet = index === 0 || item.givenName[0].toUpperCase() !== contacts[index - 1].givenName[0].toUpperCase();

        return (
          <>
            {isDifferentAlphabet && (
              <View style={styles.alphabetContainer}>
                <Text style={styles.alphabetText}>{item.givenName[0].toUpperCase()}</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => console.log(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{item.givenName}</Text>
                  {formattedPhoneNumbers.map((phoneNumber, index) => (
                    <Text key={index}>{phoneNumber}</Text>
                  ))}
                </View>
                <Image
                  source={item.hasThumbnail ? { uri: item.thumbnailPath } : require('../../assets/invite.png')}
                  style={{ width: 40, height: 30, marginRight: 8 }}
                />
                <View style={{height: 1, backgroundColor: 'lightgray'}} />
              </View>
            </TouchableOpacity>
          </>
        );
      };
    

    // Function to format phone numbers consistently
    const formatPhoneNumber = phoneNumber => {
        // Remove all non-digit characters
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        // Format the phone number with a space after every third digit
        const formattedNumber = digitsOnly.replace(/(\d{2})(\d{3})(\d+)/, '$1 $2 $3');

        return formattedNumber;
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.topbar}>
                <Image source={require('../../assets/back-arrow.png')} style={{ width: 32, height: 32 }} />
                <Image source={require('../../assets/logo.png')} style={{ width: 80, height: 20 }} />
                <Image source={require('../../assets/shop.png')} style={{ width: 20, height: 25 }} />
            </View>

            <View style={styles.divider} />

            <View style={styles.header}>
                <Text style={styles.contactlength}>{contacts.length || 0} Contacts</Text>
                <Text style={styles.title}>CONTACTS</Text>
                <Image source={require('../../assets/users.png')} style={{ width: 27, height: 22 }} />
            </View>

            {/* Dummy image, name, and + icon */}
            <View style={styles.userdata}>
                <Image source={require('../../assets/avatar.png')} style={{ width: 50, height: 50, marginRight: 16 }} />
                <Text style={{ flex: 1, fontSize: 18, fontFamily: 'Lato', color: '#000' }}>John Doe</Text>
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
                ListHeaderComponent={() => <Text style={{ fontWeight: 'bold', paddingLeft: 16 }}>Contacts</Text>}
            />

            {/* Alphabet list */}
            <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center', paddingRight: 10, }}>
                {alphabet.map(letter => (
                    <TouchableOpacity key={letter} onPress={() => scrollToLetter(letter)}>
                        <Text style={{ fontSize: 12, color: selectedAlphabet === letter ? 'gold' : 'black', paddingVertical: 1 }}>{letter}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ContactList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    topbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    divider: {
        height: 1.5,
        backgroundColor: '#BE9F56',
        marginBottom: 5,
        marginTop: 5,
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
    },
    title: {
        fontSize: 17,
        fontFamily: 'Lato',
        fontWeight: 'normal',
        color: '#000',
    },
    userdata: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
});
