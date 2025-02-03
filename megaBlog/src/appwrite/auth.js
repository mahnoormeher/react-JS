import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL) // Correct API endpoint
            .setProject(conf.appwriteProjectId); // Correct project ID

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Automatically log in after creating an account
                return this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password); // FIXED
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();    
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null; // Handle unauthenticated users
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            console.log("User logged out successfully");
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
