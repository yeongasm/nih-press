/**
 * Outputs to the console in debug mode. Does nothing other than that.
 * @param args any[]
 * @returns
 */
export function debugPrintf(...args: any[]) {
  if (process.env.NODE_ENV != "development")
    return;
  let outputStr: string = "";
  args.forEach(arg => outputStr += ` ${arg} `);
  console.debug(outputStr);
};
