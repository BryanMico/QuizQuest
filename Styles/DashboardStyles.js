import { StyleSheet } from 'react-native';

const DashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A8D98A', // Neutral background color
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Neutral text color
  },
  sidebar: {
    width: 250,
    backgroundColor: '#f8f8f8',
    padding: 20,
    justifyContent: 'flex-start',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular image
    marginBottom: 10,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto', // Push logout button to the bottom
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  // Subject styles
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  addSubjectButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  subjectItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8eaf6', // Light purple background
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  subjectText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
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
  
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  
  subjectText: {
    marginLeft: 10,
  },
  
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  
  closeButton: {
    color: 'red',
    marginTop: 10,
  }
  
});

export default DashboardStyles;
