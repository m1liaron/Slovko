import axios from "axios";
import {useState} from "react";


const useFetch = () => {
    const [loading, setLoading] = useState();
    const [error, setError] = useState();

    const instance = axios.create(({
        baseURL:'http://localhost:3000',
        timeout: 10000,
        headers:{
            'Content-Type': 'application/json',
        }
    }))

    const request = async(config) => {
        try{
            setLoading(true);
            const response = await instance(config);
            setLoading(false);
            return response;
        } catch (error){
            setLoading(false);
            setError(error);
            throw error;
        }

        return { loading, error, request };
    }
}
export  default  useFetch;