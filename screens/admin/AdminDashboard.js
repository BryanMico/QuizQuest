import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import teacherImg from "../../assets/teacher.png";
import AddTeacherModal from "./AddteacherModal";
import EditTeacherModal from "./EditTeacherModal";
import RemoveTeacherModal from "./RemoveteacherModal";
import ViewTeacherModal from "./ViewTeacherModal";
import { getAllTeachers } from "../../services/adminService";
import ErrorModal from "../components/ErrorModal";
import LoadingScreen from "../components/LoadingScreen";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (error) {
      setErrorMessage(error.message);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditModalVisible(true);
  };

  const openRemoveModal = (teacher) => {
    setSelectedTeacher(teacher);
    setRemoveModalVisible(true);
  };

  const openViewModal = (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
  };


  return (
    <SafeAreaView style={Adminstyles.container}>
      <ErrorModal
        visible={errorVisible}
        title="Failed to Load Teachers"
        message={errorMessage}
        onTryAgain={fetchTeachers}
        onCancel={() => setErrorVisible(false)}
      />

      <LoadingScreen visible={loading} />

      <TouchableOpacity style={Adminstyles.button} onPress={() => setModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Add a Teacher</Text>
      </TouchableOpacity>

      <FlatList
        data={teachers}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()} // Ensure a unique key
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image
              source={item.image ? { uri: item.image } : teacherImg}
              style={Adminstyles.cardImage}
            />
            <View style={Adminstyles.cardInfo}>
              <Text style={Adminstyles.cardTitle}>{item.name}</Text>
              <Text style={Adminstyles.cardSubtitle}>{item.subject}</Text>
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

      <AddTeacherModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={fetchTeachers} />
      <EditTeacherModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} teacher={selectedTeacher} onUpdate={fetchTeachers} />
      <RemoveTeacherModal visible={removeModalVisible} onClose={() => setRemoveModalVisible(false)} onConfirm={fetchTeachers} teacher={selectedTeacher} teacherName={selectedTeacher?.name} />
      <ViewTeacherModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} teacher={selectedTeacher} />
    </SafeAreaView>
  );
}
