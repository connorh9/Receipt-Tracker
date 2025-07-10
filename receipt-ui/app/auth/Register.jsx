import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register(){
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const submit = async () => {
        if(email.length() < 1){
            Alert.alert("Please enter an email")
            return;
        }
        if(username.length() < 6){
            Alert.alert("Username must be 6 characters long")
            return;
        }
        if(password.length() < 8){
            Alert.alert("Password must have 8 characters")
            return;
        }
        if(!(/\d/.test(password))){
            Alert.alert("Password must contain a number")
            return;
        }
        if(password !== passwordConfirm){
            Alert.alert("Password and Confirmation must match")
            return;
        }
        const result = await fetch('http://localhost:5000/register', {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                email: email,
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
            <TextInput 
                placeholder='Email'
                onChangeText={input => setEmail(input)}
            />
            <TextInput 
                placeholder='Username'
                onChangeText={input => setUsername(input)}
            />
            <TextInput 
                placeholder='Password'
                onChangeText={input => setPassword(input)}
                secureTextEntry={True}
            />
            <TextInput 
                placeholder='Confirm Password'
                onChangeText={input => setPasswordConfirm(input)}
                secureTextEntry={True}
            />

            <View style={styles.loginText}>
                <Text>Already have an account?</Text>
                <TouchableOpacity>
                    <Text style={styles.hyperlink}>Log In</Text>
                </TouchableOpacity>
            </View>
            <Button>Register</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    loginText: {

    },
    hyperlink: {

    }
})