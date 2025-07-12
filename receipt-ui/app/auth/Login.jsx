import { useState } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login(){
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submit = async () => {
        // if(email.length() < 1){
        //     Alert.alert("Please enter an email")
        //     return;
        // }
        if(username.length() < 6){
            Alert.alert("Username must be 6 characters long")
            return;
        }
        if(password.length() < 8){
            Alert.alert("Password must have 8 characters")
            return;
        }
    
        const result = await fetch('http://localhost:5000/login', {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await result.json()
        if(!result.ok){
            Alert.alert(data.message)
            return;
        }

        jwtToken = data.token
        userId = data.user_id
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user_id', data.user_id.toString());

        router.replace('/screens/Summary')

    }
    return (
        <View style={styles.container}>
            {/* <TextInput 
                placeholder='Email'
                onChangeText={input => setEmail(input)}
            /> */}
            <TextInput 
                placeholder='Username'
                onChangeText={input => setUsername(input)}
            />
            <TextInput 
                placeholder='Password'
                onChangeText={input => setPassword(input)}
                secureTextEntry={true}
            />
            
            <Button title='Login'/>
            <View style={styles.createAccount}>
                <Text style={styles.loginText}>Need to create an account?</Text>
                <TouchableOpacity>
                    <Text>Sign Up</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    loginText: {
        
    },
    hyperlink: {

    },
    createAccount: {

    }
})