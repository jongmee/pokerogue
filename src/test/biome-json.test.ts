import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import i18next from "i18next";
import { getBiomeName, biomePokemonPools, BiomePoolTier, biomeLinks, biomeTrainerPools } from "#app/data/biomes.js";
import { Species } from "#app/enums/species.js";
import { Biome } from "#app/enums/biome.js";
import { signatureSpecies } from "#app/data/trainer-config";
import { TrainerType } from "#enums/trainer-type";

// BiomePoolTier를 한국어로 변환하는 맵
enum BiomePoolTierToKo {
    COMMON = "보통",
    UNCOMMON = "드묾",
    RARE = "레어",
    SUPER_RARE = "슈퍼 레어",
    ULTRA_RARE = "울트라 레어",
    BOSS = "보스",
    BOSS_RARE = "레어 보스",
    BOSS_SUPER_RARE = "슈퍼 레어 보스",
    BOSS_ULTRA_RARE = "슈퍼 울트라 레어 보스"
}

interface BiomeTypes {
    [key: integer]: String[]
}

const biomeTypes: BiomeTypes = {
    [Biome.TOWN]: ["normal", "grass"],
    [Biome.PLAINS]: ["normal"],
    [Biome.GRASS]: ["grass"],
    [Biome.TALL_GRASS]: ["grass", "bug"],
    [Biome.SLUM]: ["poison"],
    [Biome.FOREST]: ["bug"],
    [Biome.SEA]: ["water"],
    [Biome.SWAMP]: ["poison", "water"],
    [Biome.BEACH]: ["water"],
    [Biome.LAKE]: ["water"],
    [Biome.SEABED]: ["water"],
    [Biome.MOUNTAIN]: ["flying"],
    [Biome.BADLANDS]: ["ground"],
    [Biome.CAVE]: ["rock"],
    [Biome.DESERT]: ["ground"],
    [Biome.ICE_CAVE]: ["ice"],
    [Biome.MEADOW]: ["normal", "fairy"],
    [Biome.POWER_PLANT]: ["electric"],
    [Biome.VOLCANO]: ["fire"],
    [Biome.GRAVEYARD]: ["ghost"],
    [Biome.DOJO]: ["fighting"],
    [Biome.FACTORY]: ["steel"],
    [Biome.RUINS]: ["psychic"],
    [Biome.WASTELAND]: ["dragon"],
    [Biome.ABYSS]: ["dark"],
    [Biome.SPACE]: ["psychic"],
    [Biome.CONSTRUCTION_SITE]: ["ground", "rock"],
    [Biome.JUNGLE]: ["grass", "bug"],
    [Biome.FAIRY_CAVE]: ["fairy"],
    [Biome.TEMPLE]: ["ghost"],
    [Biome.METROPOLIS]: ["normal"],
    [Biome.SNOWY_FOREST]: ["ice"],
    [Biome.ISLAND]: ["water", "grass"],
    [Biome.LABORATORY]: ["steel", "psychic"],
    [Biome.END]: ["dragon"]
};

interface TrainerTypes {
    [key: integer]: String[]
}

const trainerTypes: TrainerTypes = {
    [TrainerType.CILAN]: ["grass"],
    [TrainerType.CHILI]: ["fire"],
    [TrainerType.CRESS]: ["water"],
    [TrainerType.CHEREN]: ["normal"],
    [TrainerType.ERIKA]: ["grass", "poison"],
    [TrainerType.GARDENIA]: ["grass"],
    [TrainerType.VIOLA]: ["bug"],
    [TrainerType.BRASSIUS]: ["grass"],
    [TrainerType.WHITNEY]: ["fairy", "normal"],
    [TrainerType.NORMAN]: ["normal"],
    [TrainerType.IONO]: ["electric"],
    [TrainerType.LARRY]: ["normal"],
    [TrainerType.BUGSY]: ["bug"],
    [TrainerType.BURGH]: ["bug"],
    [TrainerType.KATY]: ["bug"],
    [TrainerType.MARLON]: ["water"],
    [TrainerType.JANINE]: ["poison"],
    [TrainerType.ROXIE]: ["poison"],
    [TrainerType.MISTY]: ["water"],
    [TrainerType.KOFU]: ["water"],
    [TrainerType.CRASHER_WAKE]: ["water"],
    [TrainerType.JUAN]: ["water"],
    [TrainerType.FALKNER]: ["flying"],
    [TrainerType.WINONA]: ["flying"],
    [TrainerType.SKYLA]: ["flying"],
    [TrainerType.CLAY]: ["ground"],
    [TrainerType.GRANT]: ["rock"],
    [TrainerType.BROCK]: ["rock"],
    [TrainerType.ROXANNE]: ["rock"],
    [TrainerType.ROARK]: ["rock"],
    [TrainerType.GORDIE]: ["rock"],
    [TrainerType.PRYCE]: ["ice"],
    [TrainerType.BRYCEN]: ["ice"],
    [TrainerType.WULFRIC]: ["ice"],
    [TrainerType.GRUSHA]: ["ice"],
    [TrainerType.LENORA]: ["normal"],
    [TrainerType.MILO]: ["grass"],
    [TrainerType.VOLKNER]: ["electric"],
    [TrainerType.ELESA]: ["electric"],
    [TrainerType.CLEMONT]: ["electric"],
    [TrainerType.BLAINE]: ["fire"],
    [TrainerType.FLANNERY]: ["fire"],
    [TrainerType.KABU]: ["fire"],
    [TrainerType.MORTY]: ["ghost"],
    [TrainerType.ALLISTER]: ["ghost"],
    [TrainerType.RYME]: ["ghost"],
    [TrainerType.BRAWLY]: ["fighting"],
    [TrainerType.MAYLENE]: ["fighting"],
    [TrainerType.KORRINA]: ["fighting"],
    [TrainerType.BEA]: ["fighting"],
    [TrainerType.JASMINE]: ["steel"],
    [TrainerType.BYRON]: ["steel"],
    [TrainerType.SABRINA]: ["psychic"],
    [TrainerType.TATE]: ["psychic"],
    [TrainerType.LIZA]: ["psychic"],
    [TrainerType.TULIP]: ["psychic"],
    [TrainerType.CLAIR]: ["water"],
    [TrainerType.DRAYDEN]: ["dragon"],
    [TrainerType.RAIHAN]: ["dragon"],
    [TrainerType.MARNIE]: ["dark"],
    [TrainerType.OLYMPIA]: ["psychic"],
    [TrainerType.LT_SURGE]: ["electric"],
    [TrainerType.CHUCK]: ["fighting"],
    [TrainerType.WATTSON]: ["electric"],
    [TrainerType.RAMOS]: ["bug"],
    [TrainerType.VALERIE]: ["fairy"],
    [TrainerType.OPAL]: ["fairy"],
    [TrainerType.BEDE]: ["psychic"],
    [TrainerType.FANTINA]: ["ghost"],
    [TrainerType.PIERS]: ["dark"],
    [TrainerType.CANDICE]: ["ice"],
    [TrainerType.MELONY]: ["ice"],
    [TrainerType.NESSA]: ["water"],
    [TrainerType.GIOVANNI]: ["poison", "dark"]
};

// 각 바이옴에 대해 JSON 파일을 생성하는 함수
const generateBiomeJsonFiles = () => {
    for (const b of Object.keys(biomePokemonPools)) {
        var aabiome = [];
        i18next.changeLanguage("en");
        const NAME = getBiomeName(b);
        i18next.changeLanguage("ko");
        const KONAME = getBiomeName(b);
        var retnb = [];
        var nb = biomeLinks[b];
        if (Array.isArray(nb)) {
            let sus: number[] = [];
            for (let i = 0; i < nb.length; i++) {
                var nbnb = nb[i];
                if (Array.isArray(nbnb)) {
                    sus.push(nbnb[1]);
                } else {
                    sus.push(1);
                }
            }
            for (let i = 0; i < sus.length; i++) {
                sus[i] = 1 / sus[i];
            }
            var ssss = 0;
            for (let i = 0; i < sus.length; i++) {
                ssss += sus[i];
            }
            ssss = 1 / ssss;

            for (let i = 0; i < nb.length; i++) {
                let vkv = {
                    name: "",
                    percentage: 1.0
                };
                var nbnb = nb[i];
                if (Array.isArray(nbnb)) {
                    vkv.name = Biome[nbnb[0]].toLowerCase();
                    vkv.percentage = ssss / nbnb[1] * 100;
                } else {
                    vkv.name = Biome[nbnb].toLowerCase();
                    vkv.percentage = ssss * 100;
                }
                retnb.push(vkv);
            }
        } else {
            if (Biome[b] !== Biome[Biome.END]) {
                let vkv = {
                    name: Biome[nb].toLowerCase(),
                    percentage: 100.0
                };
                retnb.push(vkv);
            }
        }

        let biomeData = {
            _id: Biome[b].toLowerCase(),
            name: NAME,
            koName: KONAME,
            types: biomeTypes[b],
            nextBiomes: retnb,
            nativePokemons: [],
            trainers: []
        };

        const tra = biomeTrainerPools[b];
        const trainerlist = tra[BiomePoolTier.BOSS];

        for (var t in trainerlist) {
            let tt = trainerlist[t];
            const tname = i18next.t(`trainerNames:${TrainerType[tt].toLowerCase()}`);
            let ret2: String[] = [];

            var ll = signatureSpecies[TrainerType[tt]];
            for (var spe in ll) {
                if (Array.isArray(ll[spe])) {
                    for (var c in ll[spe]) {
                        ret2.push(Species[ll[spe[c]]].toLowerCase());
                    }
                } else {
                    ret2.push(Species[ll[spe]].toLowerCase());
                }
            }

            let trainerData = {
                name: tname,
                types: trainerTypes[tt],
                pokemonIds: ret2
            };
            biomeData.trainers.push(trainerData);
        }

        for (const t of Object.keys(biomePokemonPools[b])) {
            const TIER = BiomePoolTierToKo[BiomePoolTier[t]];
            let ret: String[] = [];

            for (const tod of Object.keys(biomePokemonPools[b][t])) {
                const biomeTierTimePool = biomePokemonPools[b][t][tod];
                for (let e = 0; e < biomeTierTimePool.length; e++) {
                    let x = biomeTierTimePool[e];
                    if (typeof x === 'object') {
                        let y = Object.values(x);
                        for (let i = 0; i < y.length; i++) {
                            ret.push(Species[y[i][0]].toLowerCase());
                        }
                    } else {
                        ret.push(Species[x].toLowerCase());
                    }
                }
            }

            ret = [...new Set(ret)];
            let nativePokemonData = {
                tier: TIER,
                pokemonIds: ret
            };
            biomeData.nativePokemons.push(nativePokemonData);
        }
        aabiome.push(biomeData);

        let jsonFilePath = path.join(__dirname, `biome/${Biome[b].toLowerCase()}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(aabiome, null, 2));
    }
};

// 테스트 스위트 추가
describe('Biome JSON 파일 생성 테스트', () => {
    it('JSON 파일이 올바르게 생성되는지 테스트', () => {
        generateBiomeJsonFiles();
    });
});