import { DatabaseService, EntrySchema } from "@a-list/core";

function databaseErrorResponse(error: unknown): Response {
  console.error("A-List entries API failed", error);

  return Response.json(
    {
      error: "Failed to access A-List entries",
      ...(process.env.NODE_ENV === "development"
        ? { details: error instanceof Error ? error.message : "Unknown error" }
        : {}),
    },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const database = new DatabaseService();

    const queryParams = new URL(request.url).searchParams;

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
    const body: unknown = await request.json().catch(() => undefined);
    const parsed = EntrySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid entry", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const database = new DatabaseService();
    await database.addEntry(parsed.data);
    return Response.json({ message: "Success!" });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
