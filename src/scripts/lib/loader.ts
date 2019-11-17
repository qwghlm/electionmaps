import * as d3 from "d3";

function getPathname(url: string): string {
  const el = document.createElement("a");
  el.href = url;
  return el.pathname;
}

export default function load(url: string): Promise<unknown> {
  const pathname = getPathname(url);

  if (pathname.match(/\.csv$/)) {
    return d3.csv(url);
  }
  else if (pathname.match(/\.tsv$/)) {
    return d3.tsv(url);
  }
  return d3.json(url);
}
