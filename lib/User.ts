"use server"
import { PrismaClient } from "@/app/generated/prisma";
import { signIn } from "next-auth/react";

const prisma = new PrismaClient();

 async function createUser(data: RegisterFormData) {
  try {
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        jobTitle: data.jobTitle,
        workEmail: data.workEmail,
        password: data.password, // plain text for now
        mobilePhone: data.mobilePhone,
        legalCompanyName: data.legalCompanyName,
        companyType: data.companyType,
        countryOfRegistration: data.countryOfRegistration,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        companyWebsite: data.companyWebsite,
        businessRegistrationNumber: data.businessRegistrationNumber,
        taxID: data.taxID,
        // Optionally store uploaded file name or path
        documentFile: "fileName",
      },
    });
        // 2️⃣ Auto-login using Auth.js
        await signIn("credentials", {
            email: data.workEmail,
            password: data.password,
            redirect: false,
          });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export type RegisterFormData = {
    fullName: string;
    jobTitle: string;
    workEmail: string;
    password: string;
    passwordConfirm: string;
    mobilePhone: string;
    legalCompanyName: string;
    companyType: string;
    countryOfRegistration: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    companyWebsite: string;
    businessRegistrationNumber: string;
    taxID: string;
    documentFile?: string | null; // optional, since you handle file separately
  };
  


  async function getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
  export { createUser,getUserById };