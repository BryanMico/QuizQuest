import { StyleSheet } from 'react-native';

export const Adminstyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#27AE60', // green background
  },

  // Primary solid button
  button: {
    marginTop: 15,
    backgroundColor: '#000000', // black button
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999, // pill shape
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Secondary outline button
  outlineButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  outlineButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },

  list: {
    width: '100%',
    alignItems: 'center',
  },

  card: {
    flexDirection: 'row',
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
    marginLeft:5,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
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

  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFD83D',
    borderRadius: 999,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },

  badgeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 6,
  },
  pointsBadge: {
    backgroundColor: "#000000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    elevation: 4,
  },
  pointsBadge2: {
    backgroundColor: "#FFD83D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    elevation: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
  paddingHorizontal: 10,
},

actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  backgroundColor: '#f2e8cf',
  borderWidth: 1,
  borderColor: '#d3d3d3',
},

actionText: {
  marginLeft: 6,
  fontSize: 14,
  color: '#264653',
  fontWeight: '500',
},
  teacherCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: '95%',           // responsive width
    maxWidth: 1450,         // limit for big screens
    alignSelf: 'center',
  },
});
