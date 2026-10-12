import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { addMenuItem } from '../storage';
import { colours, spacing } from '../theme';

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function AddDishScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  // Error message for each field. Empty string means no error.
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    course: '',
    price: '',
  });

  const validate = () => {
    const newErrors = { name: '', description: '', course: '', price: '' };

    if (!name.trim()) {
      newErrors.name = 'Dish name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!course) {
      newErrors.course = 'Please select a course';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const amount = parseFloat(price);
      if (Number.isNaN(amount) || amount <= 0) {
        newErrors.price = 'Price must be a number greater than 0';
      }
    }

    setErrors(newErrors);
    return (
      newErrors.name === '' &&
      newErrors.description === '' &&
      newErrors.course === '' &&
      newErrors.price === ''
    );
  };

  const clearError = (field) => {
    setErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const handleSave = async () => {
    if (!validate()) return;

    const dish = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      course,
      price: parseFloat(price),
    };

    await addMenuItem(dish);

    setName('');
    setDescription('');
    setCourse('');
    setPrice('');

    // Go back to the menu and show a confirmation there.
    navigation.navigate('Menu', { saved: dish.name });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add Menu Item</Text>
          <Text style={styles.subtitle}>Enter the details of your new dish</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Dish Name</Text>
            <TextInput
              style={[styles.input, errors.name !== '' && styles.inputError]}
              placeholder="e.g. Creamy Mushroom Risotto"
              placeholderTextColor={colours.placeholder}
              value={name}
              onChangeText={(text) => {
                setName(text);
                clearError('name');
              }}
            />
            {errors.name !== '' && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline, errors.description !== '' && styles.inputError]}
              placeholder="A short description of the dish"
              placeholderTextColor={colours.placeholder}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                clearError('description');
              }}
              multiline
              numberOfLines={4}
            />
            {errors.description !== '' && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            <Text style={styles.label}>Course</Text>
            <View style={[styles.pickerWrap, errors.course !== '' && styles.inputError]}>
              <Picker
                selectedValue={course}
                onValueChange={(value) => {
                  setCourse(value);
                  clearError('course');
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select a course..." value="" color={colours.placeholder} />
                {COURSES.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
            {errors.course !== '' && <Text style={styles.errorText}>{errors.course}</Text>}

            <Text style={styles.label}>Price (R)</Text>
            <TextInput
              style={[styles.input, errors.price !== '' && styles.inputError]}
              placeholder="e.g. 45.50"
              placeholderTextColor={colours.placeholder}
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                clearError('price');
              }}
              keyboardType="decimal-pad"
            />
            {errors.price !== '' && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Dish</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colours.background,
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colours.primary,
  },
  subtitle: {
    fontSize: 15,
    color: colours.muted,
    marginTop: 4,
    marginBottom: spacing.l,
  },
  card: {
    backgroundColor: colours.card,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D3D3D',
    marginBottom: 8,
    marginTop: spacing.m,
  },
  input: {
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colours.text,
    backgroundColor: colours.inputBg,
  },
  inputError: {
    borderColor: colours.error,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: 10,
    backgroundColor: colours.inputBg,
    overflow: 'hidden',
  },
  picker: {
    color: colours.text,
  },
  errorText: {
    color: colours.error,
    fontSize: 13,
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: colours.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: colours.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
});
