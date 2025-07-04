import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Button, Image, View, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'

export default function Capture() {
    const [image, setImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access gallery is required!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.7
        })
        
        if(!result.canceled){
            setImage(result.assets[0].uri)
            uploadImageToAPI()
        }
        setImage(null)
    }

    const takeImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if(!permissionResult.granted){
            alert('Camera permission required!')
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            
        })
        if(!result.canceled){
            setImage(result.assets[0].uri)
            uploadImageToAPI()
        }
        setImage(null)
    }
//will need to add sending auth token
    const uploadImageToAPI = async () => {
        userId = '1234'
        const formData = new FormData()
        formData.append("image", image)
        formData.append("user_id", userId)
        setIsUploading(true)

        const result = await fetch('http://localhost:5000/upload', {
            method:'POST',
            body: formData
        })
        setIsUploading(false)

        if(!result.ok){
            throw new Error(result.status)
        }
        const json = await result.json()
        console.log(json)
    }

    return (
        <View style={styles.container}>
            {isUploading ? 
            <>
                <Text style={{fontSize:20, textAlign:'center'}}>Uploading</Text>
                <ActivityIndicator size='large'/>
            </> 
            :
            <>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={pickImage}
                    disabled={isUploading}
                >
                    <ImageBackground 
                        style={styles.background}
                        source={"photoAlbumpic"}
                        imageStyle={styles.imageStyle}>
                        <Text style={styles.buttonText}>Select image from photos</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={takeImage}
                    disabled={isUploading}
                >
                    <ImageBackground style={styles.background}>
                        <Text style={styles.buttonText}>Take image with camera</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        display: flex,
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        padding: '20px',
        height:'50px',
    },
    button: {
        height:200,
        width:200,
        overflow:'hidden',
        borderRadius: 10
    },
    background: {
        flex: 1,
        justifyContent:'flex-end',
        paddingBottom:10,
        opacity:.75,
    },
    buttonText: {
        fontSize:14,
        textAlign:'center',
    },
    imageStyle: {
        resizeMode:'cover'
    }
});