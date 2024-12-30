import { NextResponse } from "next/server";
import { connectToMongoDb } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const mongoClient = await connectToMongoDb();
    const database = mongoClient.db(process.env.MONGODB_DATABASE);
    const users = database.collection(process.env.MONGODB_USERS_COLLECTION);

    if (!email) {
      const allUsers = await users.find({}).skip(0).limit(10).toArray();
      return NextResponse.json({ allUsers });
    } else {
      const user = await users.findOne({ email });

      if (!user) {
        return new Response(
          JSON.stringify({ success: false, message: "Usuário não encontrado." }),
          { status: 404 }
        );
      }

      return NextResponse.json({ user })
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
    const mongoClient = await connectToMongoDb();
    const database = mongoClient.db(process.env.MONGODB_DATABASE);
    const users = database.collection(process.env.MONGODB_USERS_COLLECTION);

    // Verificando se o e-mail já está registrado
    const existingUser = await users.findOne({ email: body.email });
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
