import * as fs from "node:fs";
import * as path from "node:path";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const keysDir = path.resolve(__dirname, "..", "..", "keys");

const PUB_KEY_PATH = path.join(keysDir, "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf-8");

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PUB_KEY,
      algorithms: ["RS256"],
      ignoreExpiration: false,
    },
    (payload, done) => {
      prisma.user
        .findUnique({
          where: { id: payload.sub.id },
        })
        .then((user) => {
          if (!user) return done(null, false);

          return done(null, payload.sub);
        })
        .catch((err) => {
          return done(err, false);
        });
    }
  )
);

export const authenticateJWT = passport.authenticate("jwt", {
  session: false,
  assignProperty: "token_user",
});
