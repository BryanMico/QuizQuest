import { StyleSheet } from 'react-native';

export const Loadingstyles = StyleSheet.create({
    overlay: {
        position: 'absolute', // Ensure it overlays on top of other content
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent background
        zIndex: 999, // Ensure it's above other elements
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
    },

});
