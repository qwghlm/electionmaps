import { PartyLookup } from "../types";

const parties: PartyLookup = {
  "Con": {
    color: "#1B62E2",
    name: "Conservative",
    abbreviation: "Con",
  },
  "Lab": {
    color: "#EE3624",
    name: "Labour",
    abbreviation: "Lab",
  },
  "UKIP": {
    color: "#6157A5",
    name: "UK Independence Party",
    abbreviation: "UKIP",
  },
  "LD": {
    color: "#f7ad19",
    name: "Lib Dem",
    abbreviation: "LD",
  },
  "Grn": {
    color: "#31a354",
    name: "Green",
    abbreviation: "Grn",
  },
  "Ind": {
    color: "#888888",
    name: "Independent",
    abbreviation: "Ind",
  },
  "Spk": {
    color: "#CCCCCC",
    name: "Speaker",
    abbreviation: "Spk",
  },
  "SNP": {
    color: "#fff200",
    name: "Scottish National Party",
    abbreviation: "SNP",
  },
  "PC": {
    color: "#3D7B3B",
    name: "Plaid Cymru",
    abbreviation: "PC",
  },

  "DUP": {
    color: "#8b7cf7",
    name: "Democratic Unionist",
    abbreviation: "DUP",
  },
  "SF": {
    color: "#67AF45",
    name: "Sinn Fein",
    abbreviation: "SF",
  },
  "UUP": {
    color: "#332D7F",
    name: "Ulster Unionist",
    abbreviation: "UUP",
  },
  "SDLP": {
    color: "#007D7C",
    name: "Social Democratic & Labour Party",
    abbreviation: "SDLP",
  },
  "AP": {
    color: "#FFCA44",
    name: "Alliance",
    abbreviation: "AP",
  },

  "NOC": {
    color: "#CCCCCC",
    name: "No Overall Control",
    abbreviation: "NOC",
  },

  "Oth": {
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
