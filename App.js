// import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAvatar from "react-native-user-avatar";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch users
  const fetchUsers = () => {
    axios
      .get("https://random-data-api.com/api/v2/users?size=10") // Fetch multiple users
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
        console.log(response.data[0].avatar);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Use effect to fetch users on initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    axios
      .get("https://random-data-api.com/api/v2/users?size=10")
      .then((response) => {
        setUsers(response.data);
        console.log("Users refreshed");
        // alert("Users refreshed");
      })
      .catch((error) => console.log(error))
      .finally(() => setRefreshing(false));
  };

  // Function to fetch a single user and add to the top of the list
  const addUser = () => {
    axios
      .get("https://random-data-api.com/api/v2/users") // Fetch a single user
      .then((response) => {
        setUsers((prevUsers) => [response.data, ...prevUsers]); // Add new user to the top
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentItem}>
      {Platform.OS === "ios" ? ( // Check for iOS platform
        <>
          <View>
            <Text style={styles.first_name}>{item.first_name}</Text>
            <Text style={styles.last_name}>{item.last_name}</Text>
          </View>
          <UserAvatar
            style={styles.avatar}
            name={`${item.first_name} ${item.last_name}`}
            src={item.avatar}
          />
        </>
      ) : (
        // For Android platform
        <>
          <UserAvatar
            style={styles.avatar}
            name={`${item.first_name} ${item.last_name}`}
            src={item.avatar}
          />
          <View>
            <Text style={styles.first_name}>{item.first_name}</Text>
            <Text style={styles.last_name}>{item.last_name}</Text>
          </View>
        </>
      )}
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "ios" ? (
          <Text style={styles.heading}>Welcome to the User List</Text>
        ) : (
          <Text style={styles.headingA}>Welcome to the User List</Text>
        )}
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
        <TouchableOpacity style={styles.fab} onPress={addUser}>
          <MaterialIcons name="add" size={55} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  headingA: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 40,
  },
  commentItem: {
    padding: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  first_name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  last_name: {
    fontSize: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
