import { PartyLookup } from "../types";

const parties: PartyLookup = {
  "con": {
    color: "#0087DC",
    name: "Conservative",
    abbreviation: "Con",
  },
  "lab": {
    color: "#DC241f",
    name: "Labour",
    abbreviation: "Lab",
  },
  "ld": {
    color: "#FAA61A",
    name: "Lib Dem",
    abbreviation: "LD",
  },
  "ukip": {
    color: "#70147A",
    name: "UKIP",
    abbreviation: "UKIP",
  },
  "brx": {
    color: "#12B6CF",
    name: "Brexit",
    abbreviation: "Brex",
  },
  "grn": {
    color: "#6AB023",
    name: "Green",
    abbreviation: "Grn",
  },
  "ind": {
    color: "#888888",
    name: "Independent",
    abbreviation: "Ind",
  },
  "spk": {
    color: "#CCCCCC",
    name: "Speaker",
    abbreviation: "Spk",
  },
  "snp": {
    color: "#FDF38E",
    name: "Scottish National Party",
    abbreviation: "SNP",
  },
  "pc": {
    color: "#008142",
    name: "Plaid Cymru",
    abbreviation: "PC",
  },

  "dup": {
    color: "#D46A4C",
    name: "Democratic Unionist",
    abbreviation: "DUP",
  },
  "sf": {
    color: "#326760",
    name: "Sinn Fein",
    abbreviation: "SF",
  },
  "uup": {
    color: "#48A5EE",
    name: "Ulster Unionist",
    abbreviation: "UUP",
  },
  "sdlp": {
    color: "#D25469",
    name: "Social Democratic & Labour Party",
    abbreviation: "SDLP",
  },
  "ap": {
    color: "#F6CB2F",
    name: "Alliance",
    abbreviation: "AP",
  },

  "oth": {
    color: "#E0E0E0",
    name: "Other",
    abbreviation: "Oth",
  }
};

export function getPartyColor(id: string): string {
  return (id in parties) ? parties[id].color : "#FFFFFF";
}

export function getPartyName(id: string): string {
  return (id in parties) ? parties[id].name : "Unknown party";
}
