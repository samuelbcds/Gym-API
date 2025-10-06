import dotenv from "dotenv";

export default function configDotenv() {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}
