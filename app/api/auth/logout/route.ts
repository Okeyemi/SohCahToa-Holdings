import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  response.cookies.delete("tokenExpiry");
  response.cookies.delete("tokenTimestamp");
  response.cookies.delete("userRole");

  return response;
}
