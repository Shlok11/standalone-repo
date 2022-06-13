import { FastifyRequest } from "fastify";
import { createUser, generateSalt } from "./user.service";
import { createVault } from "../vault/vault.service";
import { FastifyReply } from "fastify";
import { COOKIE_DOMAIN } from "../../constants";
import logger from "../../utils/logger";

export async function registerUserHandler(
    request: FastifyRequest<
        {
            Body: Parameters<typeof createUser>[number];
        }>, reply: FastifyReply
) {
    const body = request.body;
    try {
        const user = await createUser(body);
        const salt = generateSalt()
        const vault = await createVault({ user: user._id, salt })
        const accessTokens = await reply.jwtSign({
            _id: user._id,
            email: user.email,
        });
        reply.setCookie("token", accessTokens, {
            domain: COOKIE_DOMAIN,
            path: "/",
            secure: false, //set true for prod.
            httpOnly: true,
            sameSite: false,
        });
        return reply.code(201).send({ accessTokens, vault: vault.data, salt })
    } catch (e) {
        logger.error(e, "error creating user");
        return reply.code(500).send(e);
    }
}