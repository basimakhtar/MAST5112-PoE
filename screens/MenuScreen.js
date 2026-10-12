import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { getMenuItems } from '../storage';
import { colours, spacing } from '../theme';

export default function MenuScreen({ navigation }) {
  const [menu, setMenu] = useState([]);
  const [banner, setBanner] = useState('');
  const route = useRoute();

  // Refresh the list whenever this screen is shown.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getMenuItems().then((items) => {
        if (active) setMenu(items);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  // Success message after a dish is added.
  useEffect(() => {
    const savedName = route.params?.saved;
    if (!savedName) return;
    setBanner(`"${savedName}" added to the menu`);
    const timer = setTimeout(() => setBanner(''), 4000);
    return () => clearTimeout(timer);
  }, [route.params?.saved]);

  const renderItem = ({ item, index }) => (
    <View style={styles.dishCard}>
      <View style={styles.dishHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishPrice}>R {item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.courseBadge}>
        <Text style={styles.courseBadgeText}>{item.course}</Text>
      </View>
      <Text style={styles.dishDescription}>{item.description}</Text>
      <Text style={styles.dishNumber}>Dish #{index + 1}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Our Menu</Text>
        <Text style={styles.subtitle}>
          {menu.length === 0
            ? 'No menu items yet'
            : `${menu.length} item${menu.length === 1 ? '' : 's'} on the menu`}
        </Text>
      </View>

      {banner !== '' && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{banner}</Text>
        </View>
      )}

      {menu.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>The menu is empty</Text>
          <Text style={styles.emptyText}>
            Tap the button below to add your first dish.
          </Text>
        </View>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('AddDish')}>
        <Text style={styles.addButtonText}>+ Add Dish</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.background,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
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
  },
  banner: {
    backgroundColor: colours.successBg,
    borderWidth: 1,
    borderColor: colours.success,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.m,
    marginHorizontal: spacing.l,
    marginBottom: spacing.s,
  },
  bannerText: {
    color: colours.success,
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: spacing.l,
    paddingBottom: spacing.s,
  },
  dishCard: {
    backgroundColor: colours.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colours.text,
    flex: 1,
    marginRight: 10,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.primary,
  },
  courseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colours.badgeBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
  },
  courseBadgeText: {
    color: colours.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  dishDescription: {
    fontSize: 15,
    color: '#555555',
    marginTop: 12,
    lineHeight: 22,
  },
  dishNumber: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 14,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colours.text,
  },
  emptyText: {
    fontSize: 16,
    color: colours.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: colours.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
