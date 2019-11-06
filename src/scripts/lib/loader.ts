import * as d3 from "d3";

export default function load(url: string): Promise<unknown> {

  const el = document.createElement("a");
  el.href = url;

  if (el.pathname.match(/.csv$/)) {
    return d3.csv(url);
  }

  return d3.json(url);
}
