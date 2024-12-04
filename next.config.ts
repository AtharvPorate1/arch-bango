import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com',"bangoblob.blob.core.windows.net","urltoimageblob","bangostorageaccount.blob.core.windows.net" ], // Add the domain here
  },
  // other config options here
  typescript:{
    ignoreBuildErrors:true
    
    
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
