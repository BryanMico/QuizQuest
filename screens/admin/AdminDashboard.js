import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Adminstyles } from "../../styles/Adminstyles";
import teacherImg from "../../assets/teacher.png";
import AddTeacherModal from "./AddteacherModal";
import EditTeacherModal from "./EditTeacherModal";
import RemoveTeacherModal from "./RemoveteacherModal";
import ViewTeacherModal from "./ViewTeacherModal";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([
    { id: "1", name: "John Doe", subject: "Math", image: teacherImg },
    { id: "2", name: "Jane Smith", subject: "English", image: teacherImg },
  ]);

  const handleAddTeacher = (newTeacher) => {
    setTeachers([...teachers, { id: String(teachers.length + 1), ...newTeacher }]);
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

  const handleRemoveTeacher = () => {
    setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id));
    setRemoveModalVisible(false);
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    setTeachers(teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)));
    setEditModalVisible(false);
  };

  return (
    <SafeAreaView style={Adminstyles.container}>
      <TouchableOpacity style={Adminstyles.button} onPress={() => setModalVisible(true)}>
        <Text style={Adminstyles.buttonText}>Add a Teacher</Text>
      </TouchableOpacity>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={Adminstyles.list}
        renderItem={({ item }) => (
          <View style={Adminstyles.card}>
            <Image source={item.image} style={Adminstyles.cardImage} />
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

      <AddTeacherModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddTeacher} />
      <EditTeacherModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} teacher={selectedTeacher} onUpdate={handleUpdateTeacher} />
      <RemoveTeacherModal visible={removeModalVisible} onClose={() => setRemoveModalVisible(false)} onConfirm={handleRemoveTeacher} teacherName={selectedTeacher?.name} />
      <ViewTeacherModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} teacher={selectedTeacher} />
    </SafeAreaView>
  );
}
