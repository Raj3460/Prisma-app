import app from "./app";
import { prisma } from "./lib/prisma";

const Port = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    // You can add more server initialization code here

    app.listen(Port, () => {
      console.log(`Server is running on port  http://localhost:${Port}`);
    });
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
