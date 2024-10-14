import { Op, WhereOptions } from "sequelize";

const SUPPORTED_KEYS = ["folio", "sap", "date", "kind"];

function getSearchTokens(search: string): Record<string, string> {
  const tokens: Record<string, string> = {};

  let key = "";
  let val = "";
  let state: "key" | "val" | "noState" = "noState";

  for(let i = 0; i < search.length; i++) {
    const c = search.charAt(i);

    switch(state) {
      case "key": {
        if(c === ":") {
          state = "val";
        } else {
          key += c;
        }
      } break;
      case "val": {
        // if either we encounter a space or is the last character
        // we add the token

        if(c !== ";") val += c;

        if(c === ";" || i === search.length - 1) {
          // only add supported keys to the tokens
          if(SUPPORTED_KEYS.includes(key)) {
            // TODO: validate that date is a valid date
            tokens[key] = val;
          }

          key = "";
          val = "";
          state = "noState";
        }
      } break;
      case "noState": {
        // we skip all spaces before of entering the getting key "phase"
        if(c !== " ") {
          key += c;
          state = "key";
        }
      } break;
    }
  }

  return tokens;
}


function getFiltersFromSearch(search: string): WhereOptions {
  const filters: WhereOptions = {};

  const tokens = getSearchTokens(search);

  for(const key in tokens) {
    let val = tokens[key];

    // add the like symbol to all the fields but date
    if(key !== "date") val += "%";

    filters[key] = {
      [Op.like]: val,
    };
  }

  return filters;
}

export default getFiltersFromSearch;
