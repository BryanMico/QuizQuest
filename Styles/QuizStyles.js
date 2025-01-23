// Styles/QuizStyles.js

import { StyleSheet } from 'react-native';

const QuizStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D98A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  quizList: {
    marginTop: 20,
    width: '100%',
  },
  quizContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  quizText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  completedText: {
    fontSize: 14,
    color: 'green',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  actionText: {
    fontSize: 18,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default QuizStyles;
