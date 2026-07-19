import { DatabaseService } from "@a-list/core";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function databaseErrorResponse(error: unknown): Response {
  console.error("A-List entries API failed", error);

  return Response.json(
    {
      error: "Failed to access A-List entries",
      ...(process.env.NODE_ENV === "development"
        ? { details: getErrorMessage(error) }
        : {}),
    },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const database = new DatabaseService();

    const reqUrl = new URL(request.url);
    const queryParams = new URLSearchParams(reqUrl.search);

    if (queryParams.has("slug")) {
      return Response.json(
        await database.getEntryBySlug(queryParams.getAll("slug")[0]),
      );
    }

    return Response.json(await database.retrieveAllEntries());
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const database = new DatabaseService();
    await database.addEntry(body);
    return Response.json({ message: "Success!" });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
