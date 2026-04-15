import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getOurTeamData } from "@/lib/our-team";

const app = new Hono().basePath("/api/our-team");

app.get("/", async (c) => {
  try {
    const data = await getOurTeamData();
    return c.json({
      data,
      status: "success",
      message: "Berhasil mengambil data tim",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan server";
    return c.json(
      { data: [], status: "error", message: errorMessage },
      { status: 500 },
    );
  }
});

export const GET = handle(app);
