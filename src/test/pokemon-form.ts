import * as fs from "fs";
import { Species } from "#app/enums/species.js";
import { pokemonFormChanges } from "#app/data/pokemon-forms.js";

export interface FormChangeInfo {
    from: string,
	previousForm: string,
	currentForm: string,
	item: string | null
}

export const generateFormChangeInfo = (): Map<String, FormChangeInfo[]> => {
  const re = new Map<String, FormChangeInfo[]>();
  for (const key of Object.keys(pokemonFormChanges)) {
    const formchangelist = pokemonFormChanges[key];
    // console.log(Species[key]);
    // console.log(formchangelist);
    const formchangeinfolist: FormChangeInfo[] = formchangelist.map(fc => ({
      from: Species[key].toLowerCase(),
      previousForm: fc.preFormKey,
      currentForm: fc.formKey,
      item: ""
    }));
    // for (let i = 0; i < formchangelist.length; i++) {
    // 	var formchange = formchangelist[i];
    // 	var fcinfo: FormChangeInfo = {
    // 		from: Species[key].toLowerCase(),
    // 		previousForm: formchange.preFormKey,
    // 		currentForm: formchange.formKey,
    // 		item: ""
    // 	}
    // 	formchangeinfolist.push(fcinfo);
    // }

    // console.log(formchangeinfolist);
    // console.log("\n");

    for (let i = 0; i < formchangelist.length; i++) {
      const formchange = formchangelist[i];
      const pretail = formchange.preFormKey !== "" ? "_" + formchange.preFormKey.toLowerCase().replace("-", "_").replace(" ", "_") : "";
      const pre = Species[key].toLowerCase() + pretail;
      const evotail = formchange.formKey !== "" ? "_" + formchange.formKey.toLowerCase().replace("-", "_").replace(" ", "_") : "";
      const evo = Species[formchange.speciesId].toLowerCase() + evotail;
      if (!re.has(pre)) {
        re.set(pre, [...formchangeinfolist]);
      }
      if (!re.has(evo)) {
        re.set(evo, [...formchangeinfolist]);
      }
    }
  }
  return re;
};
