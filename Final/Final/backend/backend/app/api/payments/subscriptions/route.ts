import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth.config";

export async function GET() {
  return NextResponse.json([]); // empty for now
}
