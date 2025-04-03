"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEAK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userrecord = await db.collection("users").doc(uid).get();
    if (userrecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in intead",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
    });
    return {
      success: true,
      message: "Account created Successfully",
    };
  } catch (e: any) {
    console.error("error creating a user", e);
    if (e.code === "auth/email-already-exixts") {
      return {
        success: false,
        message: "this email is already in use",
      };
    }
    return {
      success: false,
      message: "failed to create account",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEAK * 1000,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEAK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist",
      };
    }
    await setSessionCookie(idToken);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to log into account",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userrecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userrecord.exists) {
      return null;
    }
    return {
      ...userrecord.data(),
      id: userrecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function generateInterviewByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "asc")
    .get();

    return interviews.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    })) as Interview[] ;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const {userId,limit=20} = params;
  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "asc")
    .where("finilized", "==", true)
    .where("userId","!=",userId)
    .limit(limit)
    .get();

    return interviews.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    })) as Interview[] ;
}
