import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import i18next, { t } from "i18next";
import { Species } from "#app/enums/species.js";
import { Moves } from "#app/enums/moves";
import { Type } from "#app/data/type";
import { MoveCategory, MoveTarget, allMoves, MoveFlags } from "#app/data/move.js";
import { starterPassiveAbilities, allSpecies } from "#app/data/pokemon-species.js";
import { speciesEggMoves } from "#app/data/egg-moves";
import { pokemonSpeciesLevelMoves, pokemonFormLevelMoves } from "#app/data/pokemon-level-moves.js";
import { tmSpecies } from "#app/data/tms.js";

// 각 기술에 대해 JSON 파일을 생성하는 함수
const generateMoveJsonFiles = () => {
  const path = require("path");
  const fs = require("fs");
  const directoryPath = path.join(__dirname, "../../public/images/pokemon");
  const files = fs.readdirSync(directoryPath);
  const fileNamesSet = new Set<string>();
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && path.extname(file) === ".png") {
      fileNamesSet.add(file);
    }
  });

  const aamove = [];
  for (const m in allMoves) {
    const move = allMoves[m];
    const NAME = move.name;
    i18next.changeLanguage("ko");
    const i18nKey = Moves[move.id].split("_").filter(f => f).map((f, i) => i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()).join("") as unknown as string;
    move.name = move.id ? `${i18next.t(`move:${i18nKey}.name`)}` : "";
    move.effect = move.id ? `${i18next.t(`move:${i18nKey}.effect`)}` : "";

    const mmm: String[] = [];
    for (let i = 0; i < allSpecies.length; i++) {
      const spe = allSpecies[i];
      const eggMoves: Moves[] = speciesEggMoves[spe.getRootSpeciesId()];
      const moves: Moves[] = pokemonSpeciesLevelMoves[spe.speciesId].map((levelMove) => levelMove[1]);
      if (spe.forms.length !== 0) {
        for (const form of spe.forms) {
          let ret2: Moves[] = [];
          if (pokemonFormLevelMoves.hasOwnProperty(form.speciesId) && pokemonFormLevelMoves[form.speciesId].hasOwnProperty(form.formIndex)) {
            ret2 = pokemonFormLevelMoves[form.speciesId][form.formIndex].map((formlevelmove) => formlevelmove[1]);
          } else {
            for (let i = 0; i < moves.length; i++) {
              ret2.push(moves[i]);
            }
          }
          if (eggMoves.includes(move.id) || ret2.includes(move.id)) {
            const tail = form.formKey !== "" ? "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_") : "";
            const imageTail = form.getFormSpriteKey(form.formIndex) !== "" ? "-" + form.getFormSpriteKey(form.formIndex) : "";
            if (fileNamesSet.has(Species[Species[spe.speciesId]] + imageTail + ".png")) {
              mmm.push(Species[spe.speciesId].toLowerCase() + tail);
            }
          }
        }
      } else {
        if (eggMoves.includes(move.id)) {
          if (fileNamesSet.has(Species[Species[spe.speciesId]] + ".png")) {
            mmm.push(Species[spe.speciesId].toLowerCase());
          }
        } else if (moves.includes(move.id)) {
          if (fileNamesSet.has(Species[Species[spe.speciesId]] + ".png")) {
            mmm.push(Species[spe.speciesId].toLowerCase());
          }
        }
      }
    }

    const tmss = tmSpecies[move.id];
    if (Array.isArray(tmss)) {
      for (let i = 0; i < tmss.length; i++) {
        const tt = tmss[i];
        if (Array.isArray(tt)) {
          const ze = tt[0];
          for (let j = 1; j < tt.length; j++) {
            if (!mmm.includes(Species[ze].toLowerCase() + "_" + tt[j].toLowerCase().replace(" ", "_").replace("-", "_"))) {
              mmm.push(Species[ze].toLowerCase() + "_" + tt[j].toLowerCase().replace(" ", "_").replace("-", "_"));
            }
          }
        } else {
          if (!mmm.includes(Species[tt].toLowerCase())) {
            mmm.push(Species[tt].toLowerCase());
          }
        }
      }
    }

    const flagss: String[] = [];
    const moveFlagsValues = Object.values(MoveFlags).filter(value => typeof value === "number");
    for (let i = 0; i < moveFlagsValues.length; i++) {
      if (move.hasFlag(MoveFlags[MoveFlags[moveFlagsValues[i]]])) {
        flagss.push(MoveFlags[moveFlagsValues[i]].toLowerCase());
      }
    }

    const moveData = {
      _id: Moves[move.id].toLowerCase(),
      name: NAME,
      koName: move.name,
      type: Type[move._type].toLowerCase(),
      moveCategory: MoveCategory[move._category].toLowerCase(),
      moveTarget: MoveTarget[move.moveTarget].toLowerCase(),
      power: move.power,
      accuracy: move.accuracy,
      powerPoint: move.pp,
      effect: move.effect,
      effectChance: move.chance,
      prioirty: move.priority,
      generation: move.generation,
      realased: move.nameAppend,
      flags: flagss,
      pokemonIds: mmm
    };

    aamove.push(moveData);
  }
  const jsonFilePath = path.join(__dirname, "move-json-all.json");
  fs.writeFileSync(jsonFilePath, JSON.stringify(aamove, null, 2));
};

// 테스트 스위트 추가
describe("Move JSON 파일 생성 테스트", () => {
  it("JSON 파일이 올바르게 생성되는지 테스트", () => {
    generateMoveJsonFiles();
  });
});
