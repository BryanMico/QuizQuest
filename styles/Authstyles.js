import { StyleSheet } from 'react-native';

export const Authstyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a7c957',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: "#386641",
        textShadowColor: "#f2e8cf",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#386641',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 15,
        fontSize: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#f2e8cf',
        padding: 15,
        borderColor: '#386641',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#386641',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
    },
})