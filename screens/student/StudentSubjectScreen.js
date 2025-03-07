import React from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Image } from 'react-native';

// Import subject images
import mathImage from '../../assets/math.png';
import scienceImage from '../../assets/science.png';
import historyImage from '../../assets/books.png';
import englishImage from '../../assets/eng.png';


export default function StudentsSubject() {
  // Sample subjects data
  const subjects = [
    { id: '1', name: 'Mathematics', teacher: 'Mr. Smith', students: 25, image: mathImage },
    { id: '2', name: 'Science', teacher: 'Ms. Johnson', students: 18, image: scienceImage },
    { id: '3', name: 'History', teacher: 'Mr. Brown', students: 20, image: historyImage },
    { id: '4', name: 'English', teacher: 'Ms. Davis', students: 22, image: englishImage },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          numColumns={2} // Sets 2 columns
          columnWrapperStyle={styles.row} // Styles the row for spacing
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Teacher: {item.teacher}</Text>
              <Text style={styles.cardSubtitle}>Students: {item.students}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#a7c957',
  },
  sectionContainer: {
    padding: 10
  },
  row: {
    justifyContent: 'space-between', // Ensures spacing between columns
    marginBottom: 10, // Spacing between rows
  },
  card: {
    backgroundColor: '#f2e8cf',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%', // Adjusts to fit two columns
    borderWidth: 1,
    borderColor: '#386641',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Adds a subtle shadow on Android
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10, // Space between image and text
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#386641',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6a994e',
    textAlign: 'center',
    marginTop: 5,
  },
});
