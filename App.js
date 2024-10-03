import { useEffect, useState, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
} from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAvatar from "react-native-user-avatar";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Function to fetch users
  const fetchUsers = () => {
    axios
      .get("https://random-data-api.com/api/v2/users?size=10")
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
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
    setShowModal(true);
    slideUp();

    axios
      .get("https://random-data-api.com/api/v2/users?size=10")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setRefreshing(false);
        setTimeout(() => {
          slideDown();
        }, 2000);
      });
  };

  const addUser = () => {
    axios
      .get("https://random-data-api.com/api/v2/users")
      .then((response) => {
        setUsers((prevUsers) => [response.data, ...prevUsers]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentItem}>
      {Platform.OS === "ios" ? (
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
        <>
          <UserAvatar
            style={styles.avatar}
            name={`${item.first_name} ${item.last_name}`}
            src={item.avatar}
          />
          <View>
            <Text style={[styles.first_name, { textAlign: "right" }]}>
              {item.first_name}
            </Text>
            <Text style={[styles.last_name, { textAlign: "right" }]}>
              {item.last_name}
            </Text>
          </View>
        </>
      )}
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  // Slide-up animation function
  const slideUp = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Slide-down animation function
  const slideDown = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={Platform.OS === "ios" ? styles.heading : styles.headingA}>
          Welcome to the User List
        </Text>
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

        {/* Modal for refresh feedback */}
        {showModal && (
          <Modal transparent visible={showModal} animationType="none">
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>User(s) loaded</Text>
              </View>
            </Animated.View>
          </Modal>
        )}
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
    backgroundColor: "green",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalContainer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  modalContent: {
    width: "35%",
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
