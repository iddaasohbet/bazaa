import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token gerekli" },
        { status: 400 }
      );
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY tanımlı değil");
      // Development modda her zaman geçerli say
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { success: false, message: "Sunucu yapılandırma hatası" },
        { status: 500 }
      );
    }

    // Cloudflare Turnstile API'sine doğrulama isteği
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Turnstile doğrulama başarısız:", verifyData);
      return NextResponse.json(
        { success: false, message: "Doğrulama başarısız" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Turnstile doğrulama hatası:", error);
    return NextResponse.json(
      { success: false, message: "Doğrulama hatası" },
      { status: 500 }
    );
  }
}

