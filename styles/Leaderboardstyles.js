import { StyleSheet } from 'react-native';

export const Leaderboardstyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#27AE60', // green background
  },
  leaderboardContainer: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // white text for better contrast on green
    marginBottom: 10,
  },
  card: {
  flexDirection: 'row',
  justifyContent: 'space-between', // pushes points to the right end
  backgroundColor: '#ffffff',
  padding: 20,
  borderRadius: 20,
  marginVertical: 10,
  width: 400,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD83D',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    marginTop: 20,
    fontWeight: '500',
  },
});
