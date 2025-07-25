import React, { useState } from 'react'

export default function Forgot() {
    const [email, setEmail] = useState(null)
    
    return (
        <View style={styles.container}>
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
            
        </View>
    )
}