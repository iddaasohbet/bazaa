import { NextRequest, NextResponse } from "next/server";
import { incrementIlanView } from "@/lib/ilan";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ilanId = parseInt(id);
    if (!Number.isFinite(ilanId)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    await incrementIlanView(ilanId);

    const res = NextResponse.json({ success: true });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error: any) {
    console.error("❌ View increment hatası:", error);
    return NextResponse.json(
      { success: false, message: "خطا: " + error.message },
      { status: 500 }
    );
  }
}


