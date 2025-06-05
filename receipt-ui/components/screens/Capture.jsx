import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Button, Image, View, StyleSheet } from 'react-native'

export default function UploadImage() {
    const [image, setImage] = useState(null)
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
        
        if(!result.cancelled){
            setImage(result.assets[0].uri)
            uploadImage()
        }
    }

    const takeImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if(!permissionResult.granted){
            alert('Camera permission required!')
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            
        })
    }

    const uploadImage = async () => {

    }
}