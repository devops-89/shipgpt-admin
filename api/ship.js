import { shippublicApi, shipsecuredApi } from "./config";
export const shipControllers = {
    createShip:async(data)=>{
        try{
            let result= await shipsecuredApi.post("/ship",data)
            return result
        }
        catch(error){
            throw error
        }
    },
};

