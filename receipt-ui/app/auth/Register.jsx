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

        router.replace('/')

    }
    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.headerText}>Welcome to the trap house</Text>
                <Text style={{marginTop:5, color:'#592f0c'}}>Register to start tracking!</Text>
            </View>
            <View style={styles.formSection}>
                <TextInput 
                    placeholder='Email'
                    onChangeText={input => setEmail(input)}
                    style={styles.textBoxes}
                    placeholderTextColor={'#808080'}
                    accessibilityLabel='Email Box'
                />
                <TextInput 
                    placeholder='Username'
                    onChangeText={input => setUsername(input)}
                    style={styles.textBoxes}
                    placeholderTextColor={'#808080'}
                    accessibilityLabel='Username Box'
                />
                <View style={styles.passwordContainer}>
                    <TextInput 
                        placeholder='Password'
                        onChangeText={input => setPassword(input)}
                        secureTextEntry={!showPassword}
                        style={styles.passwordInput}
                        placeholderTextColor={'#808080'}
                        accessibilityLabel='Password Box'
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        accessibilityLabel={showPassword ? 'Hide Password': 'Show Passowrd'}
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
                        accessibilityLabel='Confirm Password Box'
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        accessibilityLabel={showPassword ? 'Hide Password': 'Show Passowrd'}
                    >
                        <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.registerButton} accessibilityLabel='Create Account Button'>
                <Text style={styles.registerText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.bottomSection}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity accessibilityLabel='Sign in instead'>
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
        backgroundColor: '#fdf6f0'
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8e7e6',
        borderRadius: 10,
        width: 325,
        height: 50,
        margin: 10,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: '#faf9f6'
    },
    formSection: {
        width:'100%',
        alignItems: 'center',

    },
    hyperlink: {
        color: '#542a18',
        marginTop: 4,
        textDecorationLine:'underline'
    },
    textBoxes: {
        height:50,
        width:325,
        borderWidth:1,
        margin:10,
        borderRadius: 10,
        borderColor:'#e8e7e6',
        padding: 10,
        backgroundColor: '#faf9f6',
    },
    registerButton: {
        paddingTop:'15',
        borderWidth: 1,
        borderRadius:50,
        width:325,
        height:50,
        textAlign: 'center',
        marginTop:40,
        backgroundColor:'#f5d4ba',
        borderColor:'#FDBE85'
    },
    bottomSection: {
        alignItems: 'center',
        marginBottom: 30,
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
        
    },
    registerText: {
        textAlign:'center', 
        color:'#592f0c', 
        fontSize:16,
        fontWeight:'bold',
        letterSpacing:1.5
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 10,
    },  
    logo: {
        width: 150,
        height: 150,
    },
    headerText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#182828',
        letterSpacing: 1,
    },
    loginText: {
        color:'#182828'
    }
})