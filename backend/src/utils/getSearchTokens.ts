function getSearchTokens(search: string, supportedTokens: string[]): Record<string, string> {
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
          if(supportedTokens.includes(key)) {
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

export default getSearchTokens;
