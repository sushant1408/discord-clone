import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    //   remotePatterns: [new URL("uploadthing.com")],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "g0vjvx54r3.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
