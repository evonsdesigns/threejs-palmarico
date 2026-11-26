// Lets Node's type stripping resolve the extensionless relative imports that Vite and TypeScript accept.
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND" || !/^\.\.?\//.test(specifier) || /\.[cm]?[jt]s$/.test(specifier)) throw error;
    return next(`${specifier}.ts`, context);
  }
}
