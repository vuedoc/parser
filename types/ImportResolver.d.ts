/**
 * Vuedoc Parser use [resolve](https://www.npmjs.com/package/resolve) package
 * to resolve import declarations.
 */
export interface ImportResolver {
  /**
   * Specify a set of entries that re-map imports to additional lookup locations.
   */
  alias?: Record<string, string>;
  /** directory to begin resolving from (defaults to process.cwd()) */
  basedir?: string;
  /** set to false to exclude node core modules (e.g. fs) from the search */
  includeCoreModules?: boolean;
  /** array of file extensions to search in order (defaults to ['.js', '.jsx', '.ts', '.tsx', '.vue']) */
  extensions?: string[];
  /** require.paths array to use if nothing is found on the normal node_modules recursive walk (probably don't use this) */
  paths?: string[];
  /** directory (or directories) in which to recursively look for modules. (default to 'node_modules') */
  moduleDirectory?: string[];
  /**
   * if true, doesn't resolve `basedir` to real path before resolving.
   * This is the way Node resolves dependencies when executed with the --preserve-symlinks flag.
   *
   * Note: this property is currently true by default but it will be changed to false in
   * the next major version because Node's resolution
   * algorithm does not preserve symlinks by default.
   */
  preserveSymlinks?: boolean;
}
