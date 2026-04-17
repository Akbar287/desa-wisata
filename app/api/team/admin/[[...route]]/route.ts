import { Hono } from "hono";
import { handle } from "hono/vercel";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

const app = new Hono().basePath("/api/team/admin");

const MAX_LIMIT = 50;
const GUIDE_CATEGORY_NAME = "tim pemandu wisata";
const TEAM_MEMBER_STATUSES = ["AKTIF", "TIDAK_AKTIF", "CUTI"] as const;
type TeamMemberStatus = (typeof TEAM_MEMBER_STATUSES)[number];

function getPage(query: string | undefined): number {
  const page = Number(query || "1");
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

function getLimit(query: string | undefined): number {
  const limit = Number(query || "10");
  if (!Number.isFinite(limit) || limit < 1) return 10;
  return Math.min(MAX_LIMIT, Math.floor(limit));
}

function toInt(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.floor(parsed);
}

function toTrimmed(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toOptionalTrimmed(value: unknown): string | null {
  const text = toTrimmed(value);
  return text ? text : null;
}

function normalizeCountryIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  const unique = new Set<number>();
  for (const item of value) {
    const id = toInt(item, 0);
    if (id > 0) unique.add(id);
  }

  return Array.from(unique);
}

function buildPagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

function isGuideCategoryTitle(value: string): boolean {
  return toTrimmed(value).toLowerCase() === GUIDE_CATEGORY_NAME;
}

function parseP2002Targets(err: Prisma.PrismaClientKnownRequestError): string[] {
  const target = err.meta?.target;
  if (Array.isArray(target)) return target.map((value) => String(value));
  if (typeof target === "string") return [target];
  return [];
}

async function createGuidePriceWithRetry(
  tx: Prisma.TransactionClient,
  teamMemberId: number,
  harga: string,
) {
  const payload = {
    teamMemberId,
    harga,
  };

  try {
    await tx.teamHargaPemandu.create({ data: payload });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const targets = parseP2002Targets(error);
      if (targets.some((target) => target.includes("id"))) {
        await tx.$executeRawUnsafe(`
          SELECT setval(
            pg_get_serial_sequence('"TeamHargaPemandu"', 'id'),
            GREATEST((SELECT COALESCE(MAX(id), 0) + 1 FROM "TeamHargaPemandu"), 1),
            false
          )
        `);
        await tx.teamHargaPemandu.create({ data: payload });
        return;
      }
    }

    throw error;
  }
}

function parseTeamMemberStatus(value: unknown): TeamMemberStatus {
  const normalized = toTrimmed(value).toUpperCase().replace(/\s+/g, "_");
  if (
    TEAM_MEMBER_STATUSES.includes(
      normalized as (typeof TEAM_MEMBER_STATUSES)[number],
    )
  ) {
    return normalized as TeamMemberStatus;
  }
  return "TIDAK_AKTIF";
}

const memberInclude = {
  teamCategory: {
    select: {
      id: true,
      title: true,
    },
  },
  anggotaTimNegara: {
    include: {
      negara: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  },
  teamHargaPemandu: {
    select: {
      id: true,
      harga: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 1,
  },
} as const;

function serializeMember(
  member: Awaited<
    ReturnType<
      typeof prisma.teamMember.findFirst<{
        include: typeof memberInclude;
      }>
    >
  >,
) {
  if (!member) return null;

  return {
    id: member.id,
    teamCategoryId: member.teamCategoryId,
    teamCategory: member.teamCategory,
    name: member.name,
    role: member.role,
    bio: member.bio,
    avatar: member.avatar,
    experience: member.experience,
    specialty: member.specialty,
    order: member.order,
    activeAdmin: member.activeAdmin,
    status: member.status,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    harga: member.teamHargaPemandu?.[0]?.harga ?? "",
    countries: member.anggotaTimNegara
      .map((item) => item.negara)
      .filter((item): item is { id: number; nama: string } => Boolean(item)),
  };
}

app.get("/", async (c) => {
  try {
    const page = getPage(c.req.query("page"));
    const limit = getLimit(c.req.query("limit"));
    const search = toTrimmed(c.req.query("search") || "");

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { role: { contains: search, mode: "insensitive" as const } },
            { specialty: { contains: search, mode: "insensitive" as const } },
            { bio: { contains: search, mode: "insensitive" as const } },
            {
              teamCategory: {
                title: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              anggotaTimNegara: {
                some: {
                  negara: {
                    nama: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
            },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      prisma.teamMember.findMany({
        where,
        orderBy: [{ order: "asc" }, { id: "asc" }],
        include: memberInclude,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.teamMember.count({ where }),
    ]);

    const data = rows
      .map((member) => serializeMember(member))
      .filter((member): member is NonNullable<typeof member> => Boolean(member));

    return c.json({
      data,
      pagination: buildPagination(page, limit, total),
      status: "success",
      message: "OK",
    });
  } catch (error) {
    return c.json(
      {
        data: [],
        pagination: null,
        status: "error",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
});

app.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const teamCategoryId = toInt(body.teamCategoryId, 0);
    const name = toTrimmed(body.name);
    const role = toTrimmed(body.role);
    const experience = toTrimmed(body.experience);
    const specialty = toTrimmed(body.specialty);
    const bio = toTrimmed(body.bio) || "-";
    const order = toInt(body.order, 0);
    const avatar = toOptionalTrimmed(body.avatar);
    const activeAdmin = Boolean(body.activeAdmin);
    const status = parseTeamMemberStatus(body.status);
    const harga = toTrimmed(body.harga);
    const countryIds = normalizeCountryIds(body.countryIds);

    if (!teamCategoryId) {
      return c.json(
        { data: null, status: "error", message: "Kategori tim wajib dipilih" },
        { status: 400 },
      );
    }

    if (!name || !role || !experience || !specialty) {
      return c.json(
        {
          data: null,
          status: "error",
          message: "Nama, role, pengalaman, dan keahlian wajib diisi",
        },
        { status: 400 },
      );
    }

    const category = await prisma.teamCategory.findUnique({
      where: { id: teamCategoryId },
      select: { title: true },
    });

    if (!category) {
      return c.json(
        { data: null, status: "error", message: "Kategori tim tidak ditemukan" },
        { status: 404 },
      );
    }

    const isGuideCategory = isGuideCategoryTitle(category.title);
    if (isGuideCategory && !harga) {
      return c.json(
        {
          data: null,
          status: "error",
          message: "Harga wajib diisi untuk kategori Tim Pemandu Wisata",
        },
        { status: 400 },
      );
    }

    const data = await prisma.$transaction(async (tx) => {
      const created = await tx.teamMember.create({
        data: {
          teamCategory: { connect: { id: teamCategoryId } },
          name,
          role,
          bio,
          avatar,
          experience,
          specialty,
          order,
          activeAdmin,
          status,
        },
      });

      if (countryIds.length > 0) {
        await tx.anggotaTimNegara.createMany({
          data: countryIds.map((negaraId) => ({
            teamMemberId: created.id,
            negaraId,
          })),
          skipDuplicates: true,
        });
      }

      if (isGuideCategory) {
        await createGuidePriceWithRetry(tx, created.id, harga);
      }

      return tx.teamMember.findUnique({
        where: { id: created.id },
        include: memberInclude,
      });
    });

    const serialized = serializeMember(data);

    return c.json(
      {
        data: serialized,
        status: "success",
        message: "Anggota tim berhasil ditambahkan",
      },
      { status: 201 },
    );
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.put("/", async (c) => {
  const id = toInt(c.req.query("_id"), 0);
  if (!id) {
    return c.json(
      { data: null, status: "error", message: "ID wajib" },
      { status: 400 },
    );
  }

  try {
    const body = await c.req.json();

    const teamCategoryId = toInt(body.teamCategoryId, 0);
    const name = toTrimmed(body.name);
    const role = toTrimmed(body.role);
    const experience = toTrimmed(body.experience);
    const specialty = toTrimmed(body.specialty);
    const bio = toTrimmed(body.bio) || "-";
    const order = toInt(body.order, 0);
    const avatar = toOptionalTrimmed(body.avatar);
    const activeAdmin = Boolean(body.activeAdmin);
    const status = parseTeamMemberStatus(body.status);
    const harga = toTrimmed(body.harga);
    const countryIds = normalizeCountryIds(body.countryIds);

    if (!teamCategoryId) {
      return c.json(
        { data: null, status: "error", message: "Kategori tim wajib dipilih" },
        { status: 400 },
      );
    }

    if (!name || !role || !experience || !specialty) {
      return c.json(
        {
          data: null,
          status: "error",
          message: "Nama, role, pengalaman, dan keahlian wajib diisi",
        },
        { status: 400 },
      );
    }

    const category = await prisma.teamCategory.findUnique({
      where: { id: teamCategoryId },
      select: { title: true },
    });

    if (!category) {
      return c.json(
        { data: null, status: "error", message: "Kategori tim tidak ditemukan" },
        { status: 404 },
      );
    }

    const isGuideCategory = isGuideCategoryTitle(category.title);
    if (isGuideCategory && !harga) {
      return c.json(
        {
          data: null,
          status: "error",
          message: "Harga wajib diisi untuk kategori Tim Pemandu Wisata",
        },
        { status: 400 },
      );
    }

    const data = await prisma.$transaction(async (tx) => {
      await tx.teamMember.update({
        where: { id },
        data: {
          teamCategory: { connect: { id: teamCategoryId } },
          name,
          role,
          bio,
          avatar,
          experience,
          specialty,
          order,
          activeAdmin,
          status,
        },
      });

      await tx.anggotaTimNegara.deleteMany({ where: { teamMemberId: id } });

      if (countryIds.length > 0) {
        await tx.anggotaTimNegara.createMany({
          data: countryIds.map((negaraId) => ({
            teamMemberId: id,
            negaraId,
          })),
          skipDuplicates: true,
        });
      }

      await tx.teamHargaPemandu.deleteMany({ where: { teamMemberId: id } });
      if (isGuideCategory) {
        await createGuidePriceWithRetry(tx, id, harga);
      }

      return tx.teamMember.findUnique({
        where: { id },
        include: memberInclude,
      });
    });

    const serialized = serializeMember(data);

    return c.json({
      data: serialized,
      status: "success",
      message: "Anggota tim berhasil diperbarui",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.delete("/", async (c) => {
  const id = toInt(c.req.query("_id"), 0);
  if (!id) {
    return c.json(
      { data: null, status: "error", message: "ID wajib" },
      { status: 400 },
    );
  }

  try {
    await prisma.teamMember.delete({ where: { id } });

    return c.json({
      data: null,
      status: "success",
      message: "Anggota tim berhasil dihapus",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.get("/categories", async (c) => {
  try {
    const page = getPage(c.req.query("page"));
    const limit = getLimit(c.req.query("limit"));
    const search = toTrimmed(c.req.query("search") || "");

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            {
              description: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.teamCategory.findMany({
        where,
        orderBy: [{ order: "asc" }, { id: "asc" }],
        include: { _count: { select: { members: true } } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.teamCategory.count({ where }),
    ]);

    return c.json({
      data,
      pagination: buildPagination(page, limit, total),
      status: "success",
      message: "OK",
    });
  } catch (error) {
    return c.json(
      {
        data: [],
        pagination: null,
        status: "error",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
});

app.post("/categories", async (c) => {
  try {
    const body = await c.req.json();
    const title = toTrimmed(body.title);
    const emoji = toTrimmed(body.emoji) || "👥";
    const description = toTrimmed(body.description) || "-";
    const gradient =
      toTrimmed(body.gradient) || "linear-gradient(135deg, #2D6A4F, #52B788)";
    const order = toInt(body.order, 0);

    if (!title) {
      return c.json(
        { data: null, status: "error", message: "Judul kategori wajib diisi" },
        { status: 400 },
      );
    }

    const data = await prisma.teamCategory.create({
      data: { title, emoji, description, gradient, order },
    });

    return c.json(
      {
        data,
        status: "success",
        message: "Kategori tim berhasil ditambahkan",
      },
      { status: 201 },
    );
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.put("/categories", async (c) => {
  const id = toInt(c.req.query("_id"), 0);
  if (!id) {
    return c.json(
      { data: null, status: "error", message: "ID wajib" },
      { status: 400 },
    );
  }

  try {
    const body = await c.req.json();
    const title = toTrimmed(body.title);
    const emoji = toTrimmed(body.emoji) || "👥";
    const description = toTrimmed(body.description) || "-";
    const gradient =
      toTrimmed(body.gradient) || "linear-gradient(135deg, #2D6A4F, #52B788)";
    const order = toInt(body.order, 0);

    if (!title) {
      return c.json(
        { data: null, status: "error", message: "Judul kategori wajib diisi" },
        { status: 400 },
      );
    }

    const data = await prisma.teamCategory.update({
      where: { id },
      data: { title, emoji, description, gradient, order },
    });

    return c.json({
      data,
      status: "success",
      message: "Kategori tim berhasil diperbarui",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.delete("/categories", async (c) => {
  const id = toInt(c.req.query("_id"), 0);
  if (!id) {
    return c.json(
      { data: null, status: "error", message: "ID wajib" },
      { status: 400 },
    );
  }

  try {
    await prisma.teamCategory.delete({ where: { id } });

    return c.json({
      data: null,
      status: "success",
      message: "Kategori tim berhasil dihapus",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.get("/countries", async (c) => {
  try {
    const page = getPage(c.req.query("page"));
    const limit = getLimit(c.req.query("limit"));
    const search = toTrimmed(c.req.query("search") || "");

    const where = search
      ? { nama: { contains: search, mode: "insensitive" as const } }
      : {};

    const [data, total] = await Promise.all([
      prisma.negara.findMany({
        where,
        orderBy: [{ nama: "asc" }, { id: "asc" }],
        include: { _count: { select: { anggotaTimNegara: true } } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.negara.count({ where }),
    ]);

    return c.json({
      data,
      pagination: buildPagination(page, limit, total),
      status: "success",
      message: "OK",
    });
  } catch (error) {
    return c.json(
      {
        data: [],
        pagination: null,
        status: "error",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
});

app.post("/countries", async (c) => {
  try {
    const body = await c.req.json();
    const nama = toTrimmed(body.nama);

    if (!nama) {
      return c.json(
        { data: null, status: "error", message: "Nama negara wajib diisi" },
        { status: 400 },
      );
    }

    const data = await prisma.negara.create({ data: { nama } });

    return c.json(
      {
        data,
        status: "success",
        message: "Negara berhasil ditambahkan",
      },
      { status: 201 },
    );
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.put("/countries", async (c) => {
  const id = toInt(c.req.query("_id"), 0);
  if (!id) {
    return c.json(
      { data: null, status: "error", message: "ID wajib" },
      { status: 400 },
    );
  }

  try {
    const body = await c.req.json();
    const nama = toTrimmed(body.nama);

    if (!nama) {
      return c.json(
        { data: null, status: "error", message: "Nama negara wajib diisi" },
        { status: 400 },
      );
    }

    const data = await prisma.negara.update({ where: { id }, data: { nama } });

    return c.json({
      data,
      status: "success",
      message: "Negara berhasil diperbarui",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.delete("/countries", async (c) => {
  const id = toInt(c.req.query("_id"), 0);
  if (!id) {
    return c.json(
      { data: null, status: "error", message: "ID wajib" },
      { status: 400 },
    );
  }

  try {
    await prisma.negara.delete({ where: { id } });

    return c.json({
      data: null,
      status: "success",
      message: "Negara berhasil dihapus",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

app.get("/ref", async (c) => {
  try {
    const [categories, countries] = await Promise.all([
      prisma.teamCategory.findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { id: true, title: true },
      }),
      prisma.negara.findMany({
        orderBy: [{ nama: "asc" }, { id: "asc" }],
        select: { id: true, nama: true },
      }),
    ]);

    return c.json({
      data: { categories, countries, statuses: TEAM_MEMBER_STATUSES },
      status: "success",
      message: "OK",
    });
  } catch (error) {
    return c.json(
      { data: null, status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
