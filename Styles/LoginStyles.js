import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D98A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 40,
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  lightbulb: {
    fontSize: 30,
    marginTop: 10,
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#82C91E',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#007BFF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default LoginStyles;
