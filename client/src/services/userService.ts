import type User from '@/types/User';
import type  { RecordAuthResponse, RecordModel } from 'pocketbase';
import {pb} from "./pocketbase"

export default {
    async loginUser(email: string, password: string): Promise<RecordAuthResponse<User>> {
        try {
            const authData = await pb.collection('users').authWithPassword<User>(
                email,
                password,
            );
            return authData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    async requestPasswordReset(email: string): Promise<void> {
        try{
            await pb.collection('users').requestPasswordReset(email);
            return
        }catch(error){
            throw error
        }
    },
    
    async confirmPasswordReset(token: string, password: string, passwordConfirm: string): Promise<void>{
        try{
            await pb.collection('users').confirmPasswordReset(
                token,
                password,
                passwordConfirm,
            );
        } catch(error){
            throw error
        }

    },

    async passwordChange(id: string, password: string, passwordConfirm: string): Promise<RecordAuthResponse<User>> {
        try {
            const currentUser = pb.authStore.model;
            const userEmail = currentUser?.email;
            
            if (!userEmail) {
                throw new Error('User email not found');
            }
            
            const data = {
                password: password,
                passwordConfirm: passwordConfirm
            };
            
            await pb.collection('users').update<User>(id, data);
            
            const authData = await this.loginUser(userEmail, password);
            pb.authStore.save(authData.token, authData.record);
            console.log('Password changed and user re-authenticated');
            return authData;
            
        } catch (error) {
            console.error('Password change failed:', error);
            throw error;
        }
    },
    
    userAuthenticated(): boolean {
        return pb.authStore.isValid;
    },

    async refreshAuth(): Promise<boolean> {
        try {
            await pb.collection('users').authRefresh();
            return true;
        } catch (error) {
            pb.authStore.clear();
            return false;
        }
    },

    logoutUser(): void{
        pb.authStore.clear()
    },

    getCurrentUser(): User | null {
        return pb.authStore.record as User | null;
    },
}
