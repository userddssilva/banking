import { NextResponse } from "next/server";
import { connectToMongoDb } from "@/lib/mongodb";
import { bcrypt } from "bcryptjs";

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
      const userDoc = await usersCollection.findOne({ email: email});

      if (!userDoc) {
        return new Response(
          JSON.stringify({ success: false, message: "Usuário não encontrado." }),
          { status: 404 }
        );
      }

      return NextResponse.json({ userDoc })
    }
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Erro interno do servidor." }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Obtendo os dados do corpo da requisição
    const body = await req.json();

    console.log(body);

    // Conectando ao MongoDB
    const usersCollection = getUsersCollection();

    // Verificando se o e-mail já está registrado
    const existingUser = await usersCollection.findOne({ email: body.email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "E-mail já cadastrado." }),
        { status: 400 }
      );
    }

    // Criptografar a senha (opcional, mas recomendado)
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

    await users.insertOne(newUser);

    return new Response(
      JSON.stringify({ success: true, message: "Usuário cadastrado com sucesso!" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erro interno do servidor." }),
      { status: 500 }
    );
  }
}
