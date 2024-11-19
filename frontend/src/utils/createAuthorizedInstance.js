import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createAuthorizedInstance = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        return axios.create({
            baseURL: process.env.URL || 'http://localhost:3000',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw error;
    }
};