import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Loadingstyles } from '../../styles/Loadingstyles';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000); 
  }, [navigation]);

  return (
    <View style={Loadingstyles.container}>
      <Image
        source={require('../../assets/AppLoading.gif')}
        style={Loadingstyles.logo}
      />
    </View>
  );
};


export default LoadingScreen;
