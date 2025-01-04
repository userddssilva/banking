import { NextResponse } from "next/server";
import { connectToMongoDb } from "@/lib/mongodb";

import bcrypt from "bcryptjs";

const {
  MONGODB_DATABASE: MONGODB_DATABASE,
  MONGODB_USERS_COLLECTION: MONGODB_USERS_COLLECTION
} = process.env;

async function getUsersCollection() {
  const mongoClient = await connectToMongoDb();
  const database = mongoClient.db(MONGODB_DATABASE);
  const usersCollection = database.collection(MONGODB_USERS_COLLECTION);
  return usersCollection;
}

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const usersCollection = await getUsersCollection();

    if (!email) {
      const usersDocs = await usersCollection.find({}).skip(0).limit(10).toArray();
      return NextResponse.json({ usersDocs });
    } else {
      const userDoc = await usersCollection.findOne({ email: email });

      if (!userDoc) {
        return new NextResponse(JSON.stringify({ Error: "Usuário não encontrado." }), { status: 404 });
      }

      return NextResponse.json({ userDoc })
    }
  } catch (error) {
    console.error("Erro:", error);
    return new NextResponse(JSON.stringify({ error: "Erro interno do servidor." }),{ status: 500 });
  }
}

export async function POST(req) {
  try {
    // Obtendo os dados do corpo da requisição
    const body = await req.json();

    // Conectando ao MongoDB
    const usersCollection = await getUsersCollection();

    // Verificando se o e-mail já está registrado
    const existingUser = await usersCollection.findOne({ email: body.email });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ Error: "Email já cadastrado." }), { status: 400 });
    }

    // Gera um "salt" com 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Cria o hash da senha usando o salt  
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Inserindo o novo usuário no banco de dados
    const newUser = {
      firstName: body.firstName,
      lastName: body.lastName,
      address: body.address1,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      dateOfBirth: body.dateOfBirth,
      email: body.email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return new NextResponse(JSON.stringify("Usuário cadastrado com sucesso!"), { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return new NextResponse(JSON.stringify({ Error: "Erro interno do servidor." }), { status: 500 });
  }
}
