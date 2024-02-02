import fetchData from "./utils/fetchData"

const url = process.env.REACT_APP_SERVER_URL + '/gear'

export const createGear = async(gear, currentUser, dispatch, setPage) =>{
    dispatch({type: 'START_LOADING'})

    const result = await fetchData({
        url,
        body:gear,
        token:currentUser?.token
    }, dispatch)

    if(result){
        dispatch({type:'UPDATE_ALERT', payload:{open:true, severity:'success', message:'Gear has been added successfully'}});
        dispatch({type: 'RESET_GEAR'})
        setPage(0);
    }

    dispatch({type: 'END_LOADING'});
};

export const getGears = async(dispatch)=>{
    const result = await fetchData({url, method:'GET'}, dispatch)
    if(result){
        dispatch({type:'UPDATE_GEARS', payload: result});
    }
};