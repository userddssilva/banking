import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

        // Create the session
        const expires = new Date(Date.now() + 10 * 1000);
        const session = await encrypt({ user, expires });

        // Save the session in a cookie
        cookies().set("session", session, { expires, httpOnly: true });

        return res;

    } catch (error) {
        console.error((error as Error).stack)
        return null;
    }
}