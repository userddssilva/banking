"use server"

import { headers } from "next/headers";
import { createSession } from "../session";
import bcrypt from "bcryptjs";

export async function getHost() {
    const host = headers().get('host'); // Obtém o host
    const protocol = headers().get('x-forwarded-proto') || 'http'; // Obtém o protocolo
    return `${protocol}://${host}`; // Retorna a URL completa
}

export async function signUp(userData: any) {
    try {
        const host = await getHost();
        const url = `${host}/api/database/users`;
        console.log(`URL: ${url}`);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (res.status === 400) {
            return JSON.stringify({ success: false, message: "Email já cadastrado.", status: 400 });
        }

        // Get the user data recovery from api
        const user_data = await res.json();
        console.log(`User created: ${JSON.stringify(user_data, null, 2)}`);

        // If the user is valid create a new session
        if (user_data) {
            console.log(`type: "success", user_data: ${JSON.stringify(user_data, null, 2)}`);
            createSession(user_data);
            return JSON.stringify({ success: true, message: user_data, status: 200 });
        } else {
            console.log(`type: "error", text: "Erro ao criar usuário."`);
            return null;
        }
    } catch (error) {
        console.error(`type: "error", text: ${(error as Error).stack}`);
        return null;
    }
}

export async function signIn({ email, password }: signInProps) {
    try {
        const host = await getHost();
        const url = `${host}/api/database/users?email=${email}`;
        console.log(`URL: ${url}`);

        const res = await fetch(url)
        const userFounded = await res.json();
        console.log(`User founded: ${JSON.stringify(userFounded, null, 2)}`);

        if (res.status === 404) {
            return JSON.stringify({ success: false, message: "Usuário não encontrado.", status: 404 });
        }

        // Comparando a senha fornecida com a armazenada
        const passwordMatch = await bcrypt.compare(password, userFounded.password);
        if (!passwordMatch) {
            return JSON.stringify({ success: false, message: "Senha incorreta.", status: 401 });
        }

        if (userFounded) {
            // creating a new session
            createSession(userFounded);
            return JSON.stringify({ success: true, message: userFounded, status: 200 });
        } else {
            return null;
        }
    } catch (error) {
        console.error((error as Error).stack)
        return null;
    }
}