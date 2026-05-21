import { DatabaseService } from "@a-list/core";

export async function GET(request: Request) {
  const database = new DatabaseService();

  const reqUrl = new URL(request.url);
  const queryParams = new URLSearchParams(reqUrl.search);

  if (queryParams.has("slug")) {
    return new Response(
      JSON.stringify(
        await database.getEntryBySlug(queryParams.getAll("slug")[0]),
      ),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify(await database.retrieveAllEntries()), {
    status: 200,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const database = new DatabaseService();
  await database.addEntry(body);
  return new Response(JSON.stringify({ message: "Success!" }), { status: 200 });
}
