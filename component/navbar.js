import { StatusBar, SafeAreaView, Text } from "react-native";
function Navbar() {
    return (
        <SafeAreaView style={{backgroundColor: '#6200EE', padding: 15}}>
            <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>My App</Text>
        </SafeAreaView>
    );
}

export default Navbar;