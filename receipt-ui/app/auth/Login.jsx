import { useState } from 'react';
import { AsyncStorage, Dimensions, Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;

export default function Login(){
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const resetPassword = async () => {

    }

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
                <Text style={{marginTop:5, color:'#592f0c'}}>Login to start tracking!</Text>
            </View>
            <View style={styles.formSection}>
            {/* <TextInput 
                placeholder='Email'
                onChangeText={input => setEmail(input)}
            /> */}
                <TextInput 
                    placeholder='Username'
                    placeholderTextColor={'#5D5A55'}
                    onChangeText={input => setUsername(input)}
                    style={styles.textBoxes}
                    accessibilityLabel='Username box'
                />
                <View style={styles.passwordContainer}>
                    <TextInput 
                        placeholder='Password'
                        onChangeText={input => setPassword(input)}
                        secureTextEntry={true}
                        style={styles.passwordInput}
                        placeholderTextColor={'#5D5A55'}
                        accessibilityLabel='Password box'
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        accessibilityLabel={showPassword ? 'Hide Password': 'Show Passowrd'}
                    >
                        <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={submit}
                    accessibilityLabel='Sign In Button'
                >
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.forgotPw}
                    accessibilityLabel='Forgot Password Button'
                >
                    <Text style={styles.forgotPwText}>Forgot Password?</Text>
                </TouchableOpacity>

            </View>
                
                

            <View style={styles.bottomSection}>
                <Text style={styles.registerText}>Need to create an account?</Text>
                <TouchableOpacity accessibilityLabel='Register Button' onPress={() => router.replace('/auth/Register')}>
                    <Text style={styles.hyperlink}>Sign Up</Text>
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
    loginButton: {
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
    hyperlink: {
        color: '#542a18',
        marginTop: 4,
        textDecorationLine:'underline'
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
    forgotPw: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf:'center',
        marginTop: 10
    },
    forgotPwText: {
        fontSize: 12,
        color: '#542a18',
        textDecorationLine:'underline'
    },
    signInText: {
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
    registerText: {
        color:'#182828'
    }
})