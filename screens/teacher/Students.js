import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import studentImg from "../../assets/student.png"; // Ensure this path is correct
import EditStudentModal from "./modals/studentCRUD/EditStudentModal";
import RemoveStudentModal from "./modals/studentCRUD/RemoveStudentModal";
import AddStudentModal from "./modals/studentCRUD/AddStudentModal";
import ViewStudentModal from "./modals/studentCRUD/ViewStudentModal";

export default function Students() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([
    { 
      id: "1", 
      name: "Alice Brown", 
      studentID: "102031", 
      username: "alice_b", 
      pointsEarned: 150, 
      pointsSpent: 50, 
      quizzes: [
        { id: "101", title: "Counting Adventure", date: "2025-02-25", points: 30 },
        { id: "102", title: "Adding Adventure", date: "2025-02-26", points: 40 },
      ],
      image: studentImg
    },
    { 
      id: "2", 
      name: "Bob Johnson", 
      studentID: "203023", 
      username: "bob_j", 
      pointsEarned: 120, 
      pointsSpent: 30, 
      quizzes: [
        { id: "101", title: "Counting Adventure", date: "2025-02-25", points: 30 },
      ],
      image: studentImg
    },
  ]);
  

  const handleAddStudent = (newStudent) => {
    setStudents([...students, { id: String(students.length + 1), ...newStudent }]);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalVisible(true);
  };

  const openRemoveModal = (student) => {
    setSelectedStudent(student);
    setRemoveModalVisible(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
  };
  

  const handleRemoveStudent = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    setRemoveModalVisible(false);
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents(students.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    setEditModalVisible(false);
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <TouchableOpacity style={Adminstyles.button} onPress={() => setModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Create a Student</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.name}</Text>
              <Text style={Adminstyles.cardSubtitle}>ID: {item.studentID}</Text>
            </View>
            <TouchableOpacity style={Adminstyles.viewButton} onPress={() => openEditModal(item)}>
              <MaterialIcons name="edit" size={24} color="#386641" />
            </TouchableOpacity>
            <TouchableOpacity style={Adminstyles.viewButton} onPress={() => openRemoveModal(item)}>
              <MaterialIcons name="delete" size={24} color="#bc4749" />
            </TouchableOpacity>
            <TouchableOpacity style={Adminstyles.viewButton} onPress={() => openViewModal(item)}>
                <MaterialIcons name="view-list" size={24} color="#184e77" />
             </TouchableOpacity>
          </View>
        )}
      />

      <AddStudentModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddStudent} />
      <EditStudentModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} student={selectedStudent} onUpdate={handleUpdateStudent} />
      <RemoveStudentModal visible={removeModalVisible} onClose={() => setRemoveModalVisible(false)} onConfirm={handleRemoveStudent} studentName={selectedStudent?.name} />
      <ViewStudentModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} student={selectedStudent} />
      </SafeAreaView>
  );
}
