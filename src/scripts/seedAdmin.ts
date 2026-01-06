import { error } from "node:console";
import { prisma } from "../lib/prisma"
import { UserRole } from "../middleware/auth"

async function seedAdmin() {
    console.log("🚀 Seeding process start hocche...");

    try {
        const adminData = {
            name: "Admin2 shaheb1",
            email: "admin2@gmail.com",
            role: UserRole.ADMIN,
            password: "admin1234",
        }

        // check user exist on db or not
        console.log(`🔍 Checking: ${adminData.email} ki database-e ache?`);
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            console.log("❌ User already exists. Process stop kora holo.");
            throw new Error("User already existing!!");
        }

        console.log("✅ User pawa jayni. Ebar Sign-up request pathano hocche...");
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        });

        if (signUpAdmin.ok) {
            console.log("👍 Sign-up success! Ebar email verify kora hocche...");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
            console.log("⭐ Admin successfully created and verified!");
        } else {
            console.log("⚠️ Sign-up request fail koreche. Status:", signUpAdmin.status);
        }

    } catch (err) {
        console.log("🔥 Error dhora poreche:");
        console.log(err);
    } finally {
        console.log("🏁 Seeding process finished.");
    }
}

seedAdmin();