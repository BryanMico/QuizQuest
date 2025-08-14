import { StyleSheet } from 'react-native';

export const Loadingstyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 174, 96, 0.9)', // green with opacity
    zIndex: 999,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    tintColor: '#000000', // black for strong contrast
  },
});
