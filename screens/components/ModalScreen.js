import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Modalstyles } from "../../styles/Modalstyles";
import AntDesign from '@expo/vector-icons/AntDesign';


export default function ReusableModal({ visible, onClose, title, children }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={Modalstyles.overlay}>
        <View style={Modalstyles.modalContainer}>
          <Text style={Modalstyles.modalTitle}>{title}</Text>
          <View style={Modalstyles.modalContent}>{children}</View>
          <TouchableOpacity style={Modalstyles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

