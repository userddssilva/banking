"use server"

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parseStringify } from "../utils";
import { headers } from "next/headers";

import * as Sentry from '@sentry/nextjs';
import bcrypt from "bcryptjs";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(paylod: any) {
    return await new SignJWT(paylod)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("10 sec from now")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

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

        // Get the user data recovery from api
        const data = await res.json();
        if (!res.ok) {
            // throw new Error(data.message);
            if (res.status === 400){
                //TODO: Tratar o erro de email já cadastrado
                return null;
            }
        }

        // If the user is valid create a new session
        createSession(data);

        console.log(`type: "success", text: ${data.message}`);
        return res;
    } catch (error) {
        Sentry.captureException(error);
        console.error(`type: "error", text: ${(error as Error).stack}`);
        return null;
    }
}

export async function signIn({ email, password }: signInProps) {
    try {
        const host =  await getHost();
        const url = `${host}/api/database/users?email=${email}`;
        console.log(`URL: ${url}`);
        const res = await fetch(url)
        const userFounded = await res.json();
        console.log(`User founded: ${userFounded}`);

        // Comparando a senha fornecida com a armazenada
        const passwordMatch = await bcrypt.compare(password, userFounded.userDoc.password);
        if (!passwordMatch) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "Senha incorreta." }),
                { status: 401 }
            );
        }

        // creating a new session
        createSession(userFounded);

        let _res = null;
        if (res) {
            _res = parseStringify(res);
        }
        return _res;
    } catch (error) {
        console.error((error as Error).stack)
        return null;
    }
}

export async function logout() {

    // Destroy the session
    console.log("Destroying the session");
    cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    console.log("Getting the session");
    const sessionValue = await decrypt(session);
    console.log(`Session user: ${sessionValue.user.userDoc}`);
    return sessionValue.user.userDoc;
}

export async function createSession(user: any) {

    // Create the session
    console.log("Starting create new session");
    const expires = new Date(Date.now() + 10 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });
    console.log("Finishing the creation of new session");
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doens't 
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 1000);

    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires
    });


    return res;
}