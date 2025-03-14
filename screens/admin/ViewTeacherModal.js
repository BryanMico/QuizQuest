import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReusableModal from "../components/ModalScreen";
import { getAllStudents } from "../../services/teacherService";
import ErrorModal from "../components/ErrorModal";
import LoadingScreen from "../components/LoadingScreen";

const ViewTeacherModal = ({ visible, onClose, teacher }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (teacher?._id) {
            setLoading(true);
            getAllStudents(teacher._id)
                .then((data) => {
                    const formattedData = data.map((student) => ({
                        id: student._id,
                        name: student.name,
                        studentID: student.studentID,
                        username: student.username,
                        dateAdded: new Date(student.createdAt).toLocaleDateString(),
                    }));
                    setStudents(formattedData);
                })
                .catch((err) => {
                    console.error('Error:', err);  
                    setError(err.message);
                })
                .finally(() => {
                    console.log('Finally block reached - Stopping loader');
                    setLoading(false);
                });
        } else {
            console.warn('No teacher ID provided. Skipping API call.');
            setLoading(false); 
        }
    }, [teacher]);

    return (
        <ReusableModal visible={visible} onClose={onClose} title={teacher?.name || "Teacher Details"}>
            <View style={styles.container}>
                {loading && <LoadingScreen />}
                {error && <ErrorModal visible={true} message={error} onClose={() => setError("")} />}

                {!loading && !error && (
                    <>
                        <Text style={styles.header}>Students Added</Text>
                        <FlatList
                            data={students}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.studentCard}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text style={styles.dateAdded}>Added: {item.dateAdded}</Text>
                                    </View>
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.info}>Student ID: {item.studentID}</Text>
                                        <Text style={styles.info}>Username: {item.username}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </>
                )}
            </View>
        </ReusableModal>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    header: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    studentCard: {
        backgroundColor: "#f1faee",
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderColor: "#386641",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    name: { fontSize: 14, fontWeight: "bold" },
    dateAdded: { fontSize: 12, color: "#555" },
    cardDetails: { marginTop: 4 },
    info: { fontSize: 12, color: "#555" },
});

export default ViewTeacherModal;
