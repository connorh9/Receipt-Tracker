import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Button, Image, View, StyleSheet } from 'react-native'

export default function UploadImage() {
    const PickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.7
        })

        
    }
}