// 解析import
const parseImport = require("parse-es-import").default;
const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

function getRealRequirePath(requirePath, requireFrom = process.cwd()) {
  const validTails = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    "/index.js",
    "/index.ts",
    "/index.jsx",
    "/index.tsx",
  ];
  try {
    if (!fs.lstatSync(requireFrom).isDirectory()) {
      requireFrom = path.dirname(requireFrom);
    }
  } catch (e) {}
  return glob.sync(
    path.resolve(
      requireFrom,
      requirePath.match(/.[jt]sx?$/)
        ? requirePath
        : `${requirePath}{${validTails.join(",")}}`
    )
  );
}



async function parsePackageImports(
  // /es/*/index.js
  entryPath,
  packageName,
  result = [],
  parsedFileMap = {}
) {
  let entryFileContent = "";
  try {
    entryFileContent = fs.readFileSync(entryPath, "utf8");
  } catch (error) {}

  const { imports } = parseImport(entryFileContent);

  parsedFileMap[entryPath] = true;

  await Promise.all(
    [...imports].map(async ({ namedImports, moduleName }) => {
      // 样式是从指定第三方包中引入的（这里应该就是当前组件库的包）
      if (moduleName === packageName) {
        namedImports.forEach(({ name }) => {
          if (result.indexOf(name) === -1) {
            result.push(name);
          }
        });
        return;
      }

      // 相对路径引入
      if (moduleName.match(/^\.{1,2}\//)) {
        const [requirePath] = getRealRequirePath(moduleName, entryPath);
        if (requirePath && !parsedFileMap[requirePath]) {
          await parsePackageImports(
            requirePath,
            packageName,
            result,
            parsedFileMap
          );
        }
      }
    })
  );

  return result;
}

module.exports = parsePackageImports;
