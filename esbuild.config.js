const esbuild = require("esbuild");
const path = require("path");
const tsconfigPaths = require("@esbuild-plugins/tsconfig-paths");
const env = "lambda";

esbuild.build({
  entryPoints: [`./src/${env}.ts`],
  outfile: `./index.js`,
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  plugins: [
    tsconfigPaths.TsconfigPathsPlugin({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
});
