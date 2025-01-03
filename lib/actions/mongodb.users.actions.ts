import { bcrypt } from "bcrypt";

export async function signUp(userData: any) {
    try {
        const res = await fetch("/api/database/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        console.log(`type: "success", text: ${data.message}`);
        return res;
    } catch (error) {
        console.error(`type: "error", text: ${(error as Error).stack}`);
        return null;
    }
}

export async function signIn({ email, password }: signInProps) {
    try {
        const res = await fetch(`/api/database/users?email=${email}`)
        const data = await res.json();
        
        console.log(data);
        return res;

    } catch (error) {
        console.error((error as Error).stack)
        return null;
    }
}