import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/payment-available");

const disabledMessage =
  "Metode pembayaran manual sudah dinonaktifkan. Gunakan Midtrans.";

app.get("/", async (c) => {
  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const limit = Math.max(1, Math.min(50, Number(c.req.query("limit")) || 10));
  return c.json({
    status: "success",
    message: disabledMessage,
    data: [],
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
    },
  });
});

app.post("/", async (c) => {
  return c.json({ status: "error", message: disabledMessage }, 410);
});

app.put("/", async (c) => {
  return c.json({ status: "error", message: disabledMessage }, 410);
});

app.delete("/", async (c) => {
  return c.json({ status: "error", message: disabledMessage }, 410);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
