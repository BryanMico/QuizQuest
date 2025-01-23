import { StyleSheet } from 'react-native';

const RewardsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D98A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  points: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    marginRight:30,
    marginLeft:20,
  },
  rewardImage: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardPoints: {
    fontSize: 14,
    color: '#555',
  },
  rewardMultiplier: {
    fontSize: 14,
    color: '#555',
  },
  redeemButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  redeemText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Modal Styles (Updated to match Dashboard modal style)
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default RewardsStyles;
