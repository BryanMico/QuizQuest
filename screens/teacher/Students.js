import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import studentImg from "../../assets/student.png";
import { getAllStudents } from "../../services/teacherService";
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditStudentModal from "./modals/studentCRUD/EditStudentModal";
import RemoveStudentModal from "./modals/studentCRUD/RemoveStudentModal";
import AddStudentModal from "./modals/studentCRUD/AddStudentModal";
import ViewStudentModal from "./modals/studentCRUD/ViewStudentModal";
import ErrorModal from "../components/ErrorModal";
import LoadingScreen from "../components/LoadingScreen";

export default function Students() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) {
        throw new Error("Teacher ID is missing.");
      }
  
      const data = await getAllStudents(teacherId);
  
      if (!data || data.length === 0) {
        setStudents([]); // Keep the list empty if no students
        return;
      }
  
      const studentData = data.map((student) => ({
        ...student,
        image: studentImg, // Add image or other properties to each student
      }));
  
      setStudents(studentData); // Set the students state with the latest data
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch students.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
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

  return (
    <SafeAreaView style={Adminstyles.container}>
      <LoadingScreen visible={loading} />

      <ErrorModal
        visible={errorVisible}
        title="Failed to Load Students"
        message={errorMessage}
        onTryAgain={fetchStudents}
        onCancel={() => setErrorVisible(false)}
      />

      <TouchableOpacity style={Adminstyles.button} onPress={() => setModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Create a Student</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item, index) => (item?.id ?? index).toString()}
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

      <AddStudentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={fetchStudents}
      />
      
      <EditStudentModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        student={selectedStudent}
        onUpdate={fetchStudents}
      />

      <RemoveStudentModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={fetchStudents}
        studentName={selectedStudent?.name}
        student={selectedStudent}
      />

      <ViewStudentModal
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        student={selectedStudent}
      />
    </SafeAreaView>
  );
}
