import { Box } from "@/infra/baseweb/Box";
import { AuthLogo } from "./AuthLogo";

export const AuthVisualPanel = () => (
  <Box className="relative hidden flex-col justify-center overflow-hidden bg-text p-14 md:flex">
    <Box className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent opacity-[0.18]" />
    <Box className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-strong opacity-[0.15]" />

    <Box className="relative flex flex-col max-w-[510px]">
      <Box className="mb-7 flex">
        <AuthLogo size={30} textSize="20px" light />
      </Box>
      <Box
        as="h2"
        className="mb-3.5 text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-white"
      >
        Find, track, and manage the creators driving your brand
      </Box>
      <Box className="mb-8 text-[14px] leading-[1.6] text-white/65">
        Discover creators, track competitors, run campaigns end-to-end, and see
        exactly what&apos;s moving the needle — all in one workspace.
      </Box>

      <Box className="rounded-[14px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-[2px]">
        <Box className="mb-3 flex items-center gap-2">
          <Box as="span" className="text-[11px] font-bold text-white">
            Monsoon Glow Launch
          </Box>
          <Box
            as="span"
            className="rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-bold"
            style={{
              color: "var(--green-400)",
              background: "rgba(74,222,128,0.15)",
            }}
          >
            Running
          </Box>
        </Box>
        <Box className="mb-2.5 flex">
          <Box className="mr-3.5 flex-1 border-r border-white/10 pr-3.5">
            <Box as="div" className="text-[15px] font-bold text-white">
              2.1Cr
            </Box>
            <Box as="div" className="text-[9.5px] text-white/50">
              Reach
            </Box>
          </Box>
          <Box className="mr-3.5 flex-1 border-r border-white/10 pr-3.5">
            <Box
              as="div"
              className="text-[15px] font-bold"
              style={{ color: "var(--green-400)" }}
            >
              4.8x
            </Box>
            <Box as="div" className="text-[9.5px] text-white/50">
              ROI
            </Box>
          </Box>
          <Box className="flex-1">
            <Box as="div" className="text-[15px] font-bold text-white">
              4
            </Box>
            <Box as="div" className="text-[9.5px] text-white/50">
              Creators
            </Box>
          </Box>
        </Box>
        <Box className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <Box className="h-full w-[84%] rounded-full bg-accent" />
        </Box>
      </Box>
    </Box>
  </Box>
);
