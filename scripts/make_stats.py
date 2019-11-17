#!/usr/bin/env python3

import csv
import operator
import re

# https://www.electoralcommission.org.uk/who-we-are-and-what-we-do/elections-and-referendums/past-elections-and-referendums/uk-general-elections/results-and-turnout-2017-uk-general-election
RAW_2017_PATH = "./raw_data/2017 UKPGE electoral data 4.csv"
# https://www.electoralcommission.org.uk/who-we-are-and-what-we-do/elections-and-referendums/past-elections-and-referendums/uk-general-elections/results-and-turnout-2015-uk-general-election
RAW_2015_PATH = "./raw_data/RESULTS.csv"

PROCESSED_2017_PATH = "../src/data/general-election-results-2017.csv"
PROCESSED_2015_PATH = "../src/data/general-election-results-2015.csv"

FIELDS = ("id", "winner")


def parse_party(party_name):
    if re.match("Conservative", party_name, flags=re.I):
        return "con"
    if re.match("Labour", party_name, flags=re.I):
        return "lab"
    if re.match("Lib(eral) Dem(ocrat)", party_name, flags=re.I):
        return "ld"
    if re.match("UK Independence Party", party_name, flags=re.I):
        return "ukip"
    if re.match("Green", party_name, flags=re.I):
        return "grn"
    if re.match("Independent", party_name, flags=re.I):
        return "ind"
    if re.match("Speaker", party_name, flags=re.I):
        return "spk"
    if re.match("(Scottish National Party|SNP)", party_name, flags=re.I):
        return "snp"
    if re.match("Plaid", party_name, flags=re.I):
        return "pc"
    if re.match("(Democratic Unionist Party|DUP)", party_name, flags=re.I):
        return "dup"
    if re.match("(Social Democratic and Labour Party|SDLP)", party_name, flags=re.I):
        return "sdlp"
    if re.match("Sinn F.?in", party_name, flags=re.I):
        return "sf"
    if re.match("(Ulster Unionist Party|UUP)", party_name, flags=re.I):
        return "uup"

    raise Exception(f"Cannot identify party name {party_name}")


def write_results(results, output_path):
    """
    Takes a set of results organised by constituency and writes out the winner to CSV
    """
    with open(output_path, "w") as g:
        csv_output = csv.DictWriter(g, FIELDS)
        csv_output.writeheader()

        sorted_codes = sorted(results.keys())
        for code in sorted_codes:
            sorted_results = sorted(results[code], key=operator.itemgetter(1))
            csv_output.writerow({
                "id": code,
                "winner": parse_party(sorted_results[-1][0])
            })

def parse_2017():
    """
    Reads the Electoral Commission's raw data file and creates a friendly CSV
    of the winners
    """
    results = {}
    with open(RAW_2017_PATH, encoding="ISO-8859-1") as f:
        next(f)
        csv_lines = csv.DictReader(f)
        for line in csv_lines:
            code = line["ONS Code"]
            constituency_result = results.get(code, [])
            constituency_result.append((
                    line["Party Identifer"],
                    int(line["Valid votes"]),
            ))
            results[code] = constituency_result

    write_results(results, PROCESSED_2017_PATH)


def parse_2015():
    """
    Reads the Electoral Commission's raw data file and creates a friendly CSV
    of the winners
    """
    results = {}
    with open(RAW_2015_PATH, encoding="ISO-8859-1") as f:
        csv_lines = csv.DictReader(f)
        for line in csv_lines:
            code = line["Constituency ID "]
            if not code:
                continue

            constituency_result = results.get(code, [])
            constituency_result.append((
                    line["Party name identifier"],
                    int(line["Votes"]),
            ))
            results[code] = constituency_result

    write_results(results, PROCESSED_2015_PATH)



if __name__ == "__main__":
    parse_2017()
    parse_2015()
