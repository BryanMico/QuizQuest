import { StyleSheet } from 'react-native';

export const Adminstyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#a7c957',
      },
      button: {
        marginTop: 10,
        backgroundColor: '#386641',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        width: 300,
        alignSelf: 'center', // This centers the button
      },
      
      buttonText: {
        color: '#f2e8cf',
        fontSize: 16,
        fontWeight: 'bold',
      },
      list: {
        width: '100%',
        alignItems: 'center',
      },
      card: {
        flexDirection: 'row',
        backgroundColor: '#f2e8cf',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        width: 350, 
        alignItems: 'center',
      },
      cardImage: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
      },
      cardInfo: {
        flex: 1,
      },
      cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      cardSubtitle: {
        fontSize: 14,
        color: 'gray',
      },
      viewButton: {
        padding: 5,
      },
      badgeContainer: {
        position: "absolute",
        top: 10,
        right: 10,
        flexDirection: "row", 
        gap: 5, 
      },
      
      pointsBadge: {
        backgroundColor: "#a7c957", 
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        zIndex: 1,
        elevation: 5,
      },
      
      pointsBadge2: {
        backgroundColor: "#f5cb5c", 
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        zIndex: 1,
        elevation: 5,
      },
      
      pointsText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#333",
      },
      
});
