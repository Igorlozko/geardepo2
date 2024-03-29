
// store all the functions that are responsible 
//for communicating with the server and the requests directed to the user

import fetchData from "./utils/fetchData"
import {v4 as uuidv4 } from 'uuid';
import uploadFile from "../firebase/uploadFile";

const url = process.env.REACT_APP_SERVER_URL + '/user'

export const register = async(user, dispatch) =>{
    dispatch({type:'START_LOADING'})

    //SEND REQUEST WITH FETCH
    const result = await fetchData({
        url:url+'/register',
        body: user,
    },dispatch)
    if(result){
        dispatch({
            type:'UPDATE_USER',
            payload: result
        }) 
        dispatch({
            type: 'CLOSE_LOGIN',
        })
        dispatch({
            type: 'UPDATE_ALERT',
            payload:{open:true, severity:'success', message:'Your account has been created'},
        });
    }

    dispatch({type:'END_LOADING'});
};

export const login = async(user, dispatch) =>{
    dispatch({type:'START_LOADING'});

    //SEND REQUEST WITH FETCH
    const result = await fetchData({
        url:url+'/login',
        body: user,
    },dispatch)
    if(result){
        dispatch({
            type:'UPDATE_USER',
            payload: result
        }); 
        dispatch({
            type: 'CLOSE_LOGIN',
        });
    }
    dispatch({type:'END_LOADING'});
};

export const updateProfile = async(currentUser, UpdatedFields, dispatch)=>{
    dispatch({type:'START_LOADING'});

    const {name, file} = UpdatedFields;
    let body = {name}
    try{
        if(file){
            const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
            // upload to firebase 
            const photoURL = await uploadFile(file, `profile${currentUser?.id}/${imageName}`);
            body ={...body, photoURL}
        }
        const result = await fetchData({url:url+'/updateProfile', method: 'PATCH', body , token: currentUser.token }, dispatch);
        if(result){
            dispatch({type:'UPDATE_USER',payload:{...currentUser, ...result} });
            dispatch({
                type: 'UPDATE_ALERT',
                payload:{open:true, severity:'success', message:'Your profile has been updated'},
            });
            dispatch({type: 'UPDATE_PROFILE', payload:{open: false, file:null, photoURL: result.photoURL}})
        }
    }catch(error){
        dispatch({
            type: 'UPDATE_ALERT',
            payload:{open:true, severity:'error', message:error.message},
        });
        console.log(error);
    }

    dispatch({type:'END_LOADING'});
}