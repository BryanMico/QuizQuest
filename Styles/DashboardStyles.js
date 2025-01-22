import { StyleSheet } from 'react-native';

const DashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5', // Neutral background color
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
});

export default DashboardStyles;
