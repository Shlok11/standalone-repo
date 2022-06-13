import { vaultModel } from "./vault.model";

export function createVault(input:{user:string,salt:string}){
    return vaultModel.create(input);
}