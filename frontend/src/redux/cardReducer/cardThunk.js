import {createAsyncThunk} from "@reduxjs/toolkit";
import {createAuthorizedInstance} from "../../utils/createAuthorizedInstance";

export const getCards = createAsyncThunk('card/fetchCards', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/cards/${data.groupId}`);
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

export const getAllStatusCards = createAsyncThunk('card/getStatusCards', async({groupId, status}) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/cards/${groupId}/${status}`);
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

export const addCard = createAsyncThunk('card/addCard', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post('/cards', data)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})


export const removeCard = createAsyncThunk('card/remove', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.delete(`/cards/${data}`)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

export const updateCard = createAsyncThunk('card/update', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.patch(`/cards/${data.id}`, data)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

export const updateCardsAfterLearn = createAsyncThunk('card/learnCards', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.put(`/cards/${data.groupId}`)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})