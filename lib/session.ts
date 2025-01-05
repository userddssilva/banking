"use server"

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
    console.log(`Session user: ${JSON.stringify(sessionValue)}`);
    return sessionValue;
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