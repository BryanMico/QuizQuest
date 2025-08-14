import { StyleSheet } from 'react-native';

export const Authstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27AE60', // green background like screenshot
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000', // black title
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999, // pill shape
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1.2,
    borderColor: '#d3d3d3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    width: '100%',
    backgroundColor: '#000000', // black solid button
    paddingVertical: 14,
    borderRadius: 999, // pill shape
    alignItems: 'center',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff', // white text
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Optional secondary yellow button
  yellowButton: {
    width: '100%',
    backgroundColor: '#FFD83D', // bright yellow
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 10,
  },
  yellowButtonText: {
    color: '#000000', // black text on yellow
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
