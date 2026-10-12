import AsyncStorage from '@react-native-async-storage/async-storage';

const MENU_KEY = '@chef_menu_items';

// Load all saved menu items. Empty list if there are none.
export async function getMenuItems() {
  try {
    const json = await AsyncStorage.getItem(MENU_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.warn('Could not load the menu:', error);
    return [];
  }
}

// Add a dish to the saved list and return the updated list.
export async function addMenuItem(item) {
  const items = await getMenuItems();
  items.push(item);
  await AsyncStorage.setItem(MENU_KEY, JSON.stringify(items));
  return items;
}
