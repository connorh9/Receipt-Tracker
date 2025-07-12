import { useState } from 'react';
import { Dimensions, Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;

export default function Register(){
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)

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
            <View style={styles.formSection}>
                <TextInput 
                    placeholder='Email'
                    onChangeText={input => setEmail(input)}
                    style={styles.textBoxes}
                    placeholderTextColor={'#808080'}
                />
                <TextInput 
                    placeholder='Username'
                    onChangeText={input => setUsername(input)}
                    style={styles.textBoxes}
                    placeholderTextColor={'#808080'}
                />
                <View style={styles.passwordContainer}>
                    <TextInput 
                        placeholder='Password'
                        onChangeText={input => setPassword(input)}
                        secureTextEntry={!showPassword}
                        style={styles.passwordInput}
                        placeholderTextColor={'#808080'}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput 
                        placeholder='Confirm Password'
                        onChangeText={input => setConfirmPassword(input)}
                        secureTextEntry={!showPassword}
                        style={styles.passwordInput}
                        placeholderTextColor={'#808080'}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.registerButton}>
                <Text style={{color:'red', textAlign:'center'}}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.bottomSection}>
                <Text>Already have an account?</Text>
                <TouchableOpacity>
                    <Text style={styles.hyperlink}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'white'
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f2f2f2',
        borderRadius: 10,
        width: 325,
        height: 50,
        margin: 10,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f2'
    },
    formSection: {
        width:'100%',
        alignItems: 'center',
        paddingTop: screenHeight * .2,

    },
    loginText: {
        
    },
    hyperlink: {

    },
    textBoxes: {
        height:50,
        width:325,
        borderWidth:1,
        margin:10,
        borderRadius: 10,
        borderColor:'#f2f2f2',
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    registerButton: {
        paddingTop:'15',
        borderWidth: 1,
        borderRadius:50,
        width:325,
        height:50,
        textAlign: 'center'
    },
    bottomSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    hyperlink: {
        color: 'blue',
        marginTop: 4
    },
    showButton: {
        padding:5
    },
    eyeText:{
        color:'#808080',
        padding: 5
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingRight: 30,
        
    }
})