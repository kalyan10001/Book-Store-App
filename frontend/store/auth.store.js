import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_URL} from "../constants/api.js"

export const useAuthStore=create((set)=>({
    user:null,
    token:null,
    isLoading:false,

    register: async(username,email,password)=>{

        set({isLoading:true});
        try {
            const res=await fetch(`${API_URL}/api/auth/register`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            })

            const data=await res.json();

            if(!res.ok)throw new Error(data.message || "something went wrong");

            await AsyncStorage.setItem("user",JSON.stringify(data.user));
            await AsyncStorage.setItem("token",JSON.stringify(data.token));

            set({token:data.token,user:data.user,isLoading:false});

            return {success:true};
        } catch (error) {
            set({isLoading:false})
            return {success:false,error:error.message};
        }

    },

   checkAuth: async () => {
  try {
    const tokenJson = await AsyncStorage.getItem("token");
    const userJson = await AsyncStorage.getItem("user");

    const token = tokenJson ? JSON.parse(tokenJson) : null;
    const user = userJson ? JSON.parse(userJson) : null;

    set({ token, user });
  } catch (error) {
    console.log("Auth Check Failed", error);
  }
},


    logout:async()=>{
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");

        set({token:null,user:null});
    },

    login:async(email,password)=>{
        set({isLoading:true});

        try{
        const res=await fetch(`${API_URL}/api/auth/login`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            })

            const data=await res.json();
            console.log("data",data);

            if(!res.ok)throw new Error(data.message || "something went wrong");

            await AsyncStorage.setItem("user",JSON.stringify(data.user));
            await AsyncStorage.setItem("token",JSON.stringify(data.token));

            set({token:data.token,user:data.user,isLoading:false});

            return {success:true};
        } catch (error) {
            set({isLoading:false})
            return {success:false,error:error.message};
        }
    }
    
}))