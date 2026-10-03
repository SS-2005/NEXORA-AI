import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
  const url = `${backendUrl}/api/v1/${path}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      return new NextResponse(res.body, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/pdf")) {
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": res.headers.get("content-disposition") || "attachment; filename=report.pdf",
        },
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend Proxy Error GET:", error);
    return NextResponse.json({ error: "Failed to fetch from backend" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
  const url = `${backendUrl}/api/v1/${path}`;

  try {
    const body = await request.json();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return new NextResponse(res.body, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend Proxy Error POST:", error);
    return NextResponse.json({ error: "Failed to fetch from backend" }, { status: 500 });
  }
}
