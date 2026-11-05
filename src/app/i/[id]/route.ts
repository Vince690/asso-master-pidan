import { db } from "@/lib/db";

/**
 * Diffusion des images envoyées depuis l'espace membres. L'identifiant est l'empreinte du contenu :
 * une adresse ne change jamais d'image, le navigateur et le CDN peuvent donc la garder un an.
 */
export async function GET(_req: Request, ctx: RouteContext<"/i/[id]">) {
  const { id } = await ctx.params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new Response("Not found", { status: 404 });
  const image = await (await db()).images.get(id);
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(image.data, "base64"), {
    headers: {
      "Content-Type": image.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
