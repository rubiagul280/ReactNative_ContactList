/* eslint-disable prettier/prettier */
import React from 'react';
import { View } from 'react-native';
import ContactList from './src/screens/ContactList';

const App = () => {

  return (
    <View style={{ flex: 1 }}>
      <ContactList />
    </View>
  );
};

export default App;
