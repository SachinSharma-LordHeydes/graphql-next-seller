import { createYoga } from "graphql-yoga";
import type { NextRequest } from "next/server";
import { schema } from "../../../servers/gql/index";
import { createContext } from "@/servers/gql/context";

const yoga = createYoga<{
  req: NextRequest;
}>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
  context: async ({ request }: { request: NextRequest }) => {
    return await createContext(request);
  },
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"]
        : ["http://localhost:3000"],
    credentials: true,
  },
});

export async function GET(request: NextRequest) {
  return yoga.handleRequest(request, { req: request });
}

export async function POST(request: NextRequest) {
  return yoga.handleRequest(request, { req: request });
}
