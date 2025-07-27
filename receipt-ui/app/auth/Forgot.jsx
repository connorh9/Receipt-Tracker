import React, { useState } from 'react';
import { AsyncStorage, Dimensions, Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Forgot() {
    const [email, setEmail] = useState(null)
    const [codeAvailable, setCodeAvailable] = useState(false)

    const submitCode = () => {
        
    }
    
    return (
        <View style={styles.container}>
            {codeAvailable ? <>
                <View style={styles.formSection}>
                {/* <TextInput 
                    placeholder='Email'
                    onChangeText={input => setEmail(input)}
                /> */}
                    <TextInput 
                        placeholder='Reset Code'
                        placeholderTextColor={'#5D5A55'}
                        onChangeText={input => setEmail(input)}
                        style={styles.textBoxes}
                        accessibilityLabel='Enter reset code'
                    />
                    
                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={submit}
                        accessibilityLabel='Submit Code'
                    >
                        <Text style={styles.signInText}>Reset Password</Text>
                    </TouchableOpacity>

                </View>
            </> 
            : 
            <>
                <View style={styles.headerSection}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerText}>Forgot Your Password?</Text>
                </View>
                <View style={styles.formSection}>
                {/* <TextInput 
                    placeholder='Email'
                    onChangeText={input => setEmail(input)}
                /> */}
                    <TextInput 
                        placeholder='Email'
                        placeholderTextColor={'#5D5A55'}
                        onChangeText={input => setEmail(input)}
                        style={styles.textBoxes}
                        accessibilityLabel='Email box'
                    />
                    
                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={submit}
                        accessibilityLabel='Reset Password'
                    >
                        <Text style={styles.signInText}>Reset Password</Text>
                    </TouchableOpacity>

                </View>
                    
                <View style={styles.bottomSection}>
                    <Text style={styles.registerText}>Need to create an account?</Text>
                    <TouchableOpacity accessibilityLabel='Register Button' onPress={() => router.replace('/auth/Register')}>
                        <Text style={styles.hyperlink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </>}
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
    submitButton: {
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