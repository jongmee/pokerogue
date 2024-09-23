import * as fs from "fs";
import { Species } from "#app/enums/species.js";
import {
  pokemonEvolutions,
  SpeciesEvolution,
  SpeciesFormEvolution,
  EvolutionItem,
} from "#app/data/pokemon-evolutions.js";

type ParsedEvolution = {
  from: string;
  level?: number | null;
  to: string;
  item?: string | null;
  condition?: string | null;
};

export const generateEvolutionChains = (): Record<string, ParsedEvolution[]> => {
  const notStarters = generateNotStarters();
  const chains: Record<string, ParsedEvolution[]> = {};

  const buildChain = (
    key: Species,
    species: Species,
    chains: Record<string, ParsedEvolution[]>,
    visited: Set<Species>
  ): void => {
    const nextEvolutions = pokemonEvolutions[species];

    if (nextEvolutions) {
      for (const evolution of nextEvolutions) {
        if (
          (evolution.evoFormKey == null && evolution.preFormKey == null) ||
          (evolution.evoFormKey == "" && evolution.preFormKey == "")
        ) {
          visited.add(evolution.speciesId);
          chains[key].push({
            from: generateCommonId(species),
            level: evolution.level,
            to: generateCommonId(evolution.speciesId),
            item: generateEvolutionItemName(evolution.item),
            condition: evolution.condition?.predicate.toString() !== undefined ? evolution.condition?.predicate.toString() : null,
          });
          buildChain(key, evolution.speciesId, chains, visited); // 재귀적으로 진화 체인 생성
        } else {
          chains[key].push({
            from: generateFormId(species, evolution.preFormKey),
            level: evolution.level,
            to: generateFormId(evolution.speciesId, evolution.evoFormKey),
            item: generateEvolutionItemName(evolution.item),
            condition: evolution.condition?.predicate.toString() !== undefined ? evolution.condition?.predicate.toString() : null,
          });
        }
      }
    }
  };

  // 모든 Pokémon에 대해 진화 체인을 생성
  const visited = new Set<Species>();
  for (const speciesKey of Object.keys(pokemonEvolutions)) {
    const species = Number(speciesKey) as Species; // speciesKey를 숫자로 변환 (Species가 enum)
    if (!notStarters.has(species) && !visited.has(species)) {
      visited.add(species);
      chains[species] = [];
      buildChain(species, species, chains, visited);
    }
  }

  return chains;
};

export const generateNotStarters = () => {
    const notStarters = new Set<Species>();
    for (const speciesKey of Object.keys(pokemonEvolutions)) {
      const species = Number(speciesKey) as Species; // speciesKey를 적절히 변환
      if (!pokemonEvolutions[species]) {
        continue;
      }
      for (const chain of pokemonEvolutions[species]) {
        notStarters.add(chain.speciesId);
      }
    }
    return notStarters;
}

export const generateCommonId = (species: Species) => {
  return Species[species].toLowerCase();
};

export const generateFormId = (species: Species, formKey: string | null) => {
  if (!formKey || formKey === "") {
    return Species[species].toLowerCase();
  }
  return (
    Species[species].toLowerCase() +
    "_" +
    formKey.toLowerCase().replace(" ", "_").replace("-", "_")
  );
};

export const generateEvolutionItemName = (item: EvolutionItem | null) => {
  if (!item) return null;
  return EvolutionItem[item].toLowerCase();
};

export const getEvolutionsById = (
  chains: Record<string, ParsedEvolution[]>,
  id: string
): ParsedEvolution[] => {
  for (const evolutions of Object.values(chains)) {
    for (const evolution of evolutions) {
      if (String(evolution.from) === id || String(evolution.to) === id) {
        return evolutions;
      }
    }
  }
  return [];
};

// 디버깅 용
export const printChains = (chains: Record<string, ParsedEvolution[]>) => {
  for (const key in chains) {
    console.log(`###Species: ${Species[Number(key)]}`);
    for (const evolution of chains[key]) {
      console.log({
        from: evolution.from,
        level: evolution.level,
        to: evolution.to,
        item: evolution.item,
        condition: evolution.condition,
      });
    }
  }
};

// 디버깅 용
export const writeChainsToJson = (
  chains: Record<string, ParsedEvolution[]>,
  fileName: string
) => {
  const result: Record<string, any> = {}; // Object to hold results for writing

  for (const key in chains) {
    result[Species[Number(key)]] = chains[key].map((evolution) => ({
      from: evolution.from,
      level: evolution.level, 
      to: evolution.to, 
      item: evolution.item, 
      condition: evolution.condition, 
    }));
  }

  fs.writeFileSync(fileName, JSON.stringify(result, null, 2)); // Pretty print with indentation
};
