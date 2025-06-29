import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Button, Image, View, StyleSheet } from 'react-native'

export default function UploadImage() {
    const [image, setImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    
    const PickImage = async () => {
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
    }

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
}