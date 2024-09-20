import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import i18next from "i18next";
import { selfPokemonBiomes } from "#app/data/biomes.js";
import { Species } from "#app/enums/species.js";
import { Biome } from "#app/enums/biome.js";
import { Abilities } from "#app/enums/abilities.js";
import { Moves } from "#app/enums/moves"
import { Type } from "#app/data/type"
import { starterPassiveAbilities, allSpecies } from "#app/data/pokemon-species.js";
import { speciesEggMoves } from "#app/data/egg-moves"
import { pokemonSpeciesLevelMoves, pokemonFormLevelMoves } from "#app/data/pokemon-level-moves.js";
import { pokemonEvolutions } from "#app/data/pokemon-evolutions.js";
import { pokemonFormChanges } from "#app/data/pokemon-forms.js";
import { Stat } from "#app/enums/stat.js";
import { tmSpecies } from "#app/data/tms.js";

// 각 포켓몬에 대해 JSON 파일을 생성하는 함수
const generatePokemonJsonFiles = () => {
    // pokemon 이미지들의 이름 목록을 Set으로 가져오기
    const directoryPath = 'C:/Users/s_osang0731/precourse/pokerogue/public/images/pokemon';
    const files = fs.readdirSync(directoryPath);
    const fileNamesSet = new Set<string>();
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (fs.statSync(filePath).isFile() && path.extname(file) === '.png') {
            fileNamesSet.add(file);
        }
    });

    // Species에 따른 Biome의 Map 생성
    const biomeMap = new Map<Species, Biome[]>();
    for (let i = 0; i < selfPokemonBiomes.length; i++) {
        var species = Species[Species[selfPokemonBiomes[i][0]]];
        var biomeEntries = selfPokemonBiomes[i][3].map((a) => Biome[a[0]].toLowerCase());
        biomeEntries = [...new Set(biomeEntries)];
        biomeMap.set(species, biomeEntries);
    }

    // Species에 따른 tms의 Map 생성
    const tmsMap = new Map<string, string[]>();
    for (const m of Object.keys(tmSpecies)) {
        var ss = tmSpecies[m];
        for (let i = 0; i < ss.length; i++) {
            var kj = ss[i];
            if (Array.isArray(kj)) {
                var kjatra = Species[kj[0]].toLowerCase()
                for (let i = 1; i < kjatra.length; i++) {
                    var kjkjkjkj = kjatra + "_" + kj[i];
                    if (tmsMap.has(kjkjkjkj)) {
                        tmsMap.get(kjkjkjkj).push(Moves[m].toLowerCase());
                    } else {
                        var mms: Moves[] = [];
                        mms.push(Moves[m].toLowerCase());
                        tmsMap.set(kjkjkjkj, mms);
                    }
                }
            } else {
                var kjtra = Species[kj].toLowerCase();
                if (tmsMap.has(kjtra)) {
                    tmsMap.get(kjtra).push(Moves[m].toLowerCase());
                } else {
                    var mms: Moves[] = [];
                    mms.push(Moves[m].toLowerCase());
                    tmsMap.set(kjtra, mms);
                }
            }
        }
    }

    for (let i = 0; i < allSpecies.length; i++) {
        let pokemon = allSpecies[i];

        // 포켓몬 데이터 형식
        let pokemonData = {
            _id: "",
            gender: "",
            pokedexNumber: "",
            name: "",
            koName: "",
            speciesName: "",
            canChangeForm: false,
            formName: "",
            baseExp: "",
            friendship: "",
            types: [],
            normalAbilityIds: [],
            hiddenAbilityId: "",
            passiveAbilityId: "",
            generation: 1,
            legendary: false,
            subLegendary: false,
            mythical: false,
            evolutions: [],
            formEvolutions: [],
            formChanges: [],
            baseTotal: 1,
            hp: 1,
            attack: 1,
            defense: 1,
            specialAttack: 1,
            specialDefense: 1,
            speed: 1,
            height: 1.0,
            weight: 1.0,
            eggMoveIds: [],
            levelMoves: [],
            technicalMachineMoveIds: [],
            biomeIds: []
        };

        // form에 상관없는 정보들
        var legend = pokemon.legendary;
        var subLegend = pokemon.subLegendary;
        var myth = pokemon.mythical;
        if (pokemon.speciesId === Species.LYCANROC) {
            console.log(pokemon.canChangeForm);
        }

        // form에 따른 포켓몬 정보 세팅
        if (true) {
            for (var form of pokemon.forms) {
                var aaformpokemon = [];
                // form 이름 체크
                var checkformname = Species[Species[form.speciesId]] + "-" + form.formKey + ".png";
                if (!fileNamesSet.has(checkformname)) {
                    continue;
                }

                // form에 따른 포켓몬 정보 파싱
                // formkoName
                i18next.changeLanguage("ko");
                const FORMKONAME = i18next.t(`pokemon:${Species[form.speciesId].toLowerCase()}`) + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_");

                // formtypes
                var formtypelist = [];
                if (form.type1 !== null) {
                    formtypelist.push(Type[form.type1].toLowerCase());
                }
                if (form.type2 !== null) {
                    formtypelist.push(Type[form.type2].toLowerCase());
                }
                formtypelist = [...new Set(formtypelist)];

                // formnormalAbilityIds
                var formabilitylist = [];
                formabilitylist.push(Abilities[form.ability1].toLowerCase());
                formabilitylist.push(Abilities[form.ability2].toLowerCase());
                formabilitylist = [...new Set(formabilitylist)];

                // formlevelmoves
                var formlevelmovelist = [];
                if (pokemonFormLevelMoves.hasOwnProperty(form.speciesId) && pokemonFormLevelMoves[form.speciesId].hasOwnProperty(form.formIndex)) {
                    var eachformlevelmovelist = pokemonFormLevelMoves[form.speciesId][form.formIndex];
                    for (let i = 0; i < eachformlevelmovelist.length; i++) {
                        let formlevelm = {
                            level: eachformlevelmovelist[i][0],
                            moveId: Moves[eachformlevelmovelist[i][1]].toLowerCase()
                        }
                        formlevelmovelist.push(formlevelm);
                    }
                } else {
                    var eachformlevelmovelist = pokemonSpeciesLevelMoves[pokemon.speciesId];
                    for (let i = 0; i < eachformlevelmovelist.length; i++) {
                        let formlevelm = {
                            level: eachformlevelmovelist[i][0],
                            moveId: Moves[eachformlevelmovelist[i][1]].toLowerCase()
                        }
                        formlevelmovelist.push(formlevelm);
                    }
                }

                // formtms
                var formtmslist = [];
                if (tmsMap.get(Species[form.speciesId].toLowerCase() + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_")) === undefined) {
                    formtmslist = [];
                } else {
                    formtmslist = tmsMap.get(Species[form.speciesId].toLowerCase() + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_"));
                }

                // form에 따른 포켓몬 정보 저장
                pokemonData._id = Species[form.speciesId].toLowerCase() + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_");
                pokemonData.gender = "";
                pokemonData.pokedexNumber = `${form.speciesId}`;;
                pokemonData.name = Species[form.speciesId].toLowerCase() + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_");
                pokemonData.koName = FORMKONAME;
                pokemonData.speciesName = Species[form.speciesId].toLowerCase();
                pokemonData.canChangeForm = true;
                pokemonData.formName = form.formName.toLowerCase().replace(" ", "_").replace("-", "_");
                pokemonData.baseExp = `${form.baseExp}`;
                pokemonData.friendship = `${form.baseFriendship}`;
                pokemonData.types = formtypelist;
                pokemonData.normalAbilityIds = formabilitylist;
                pokemonData.hiddenAbilityId = Abilities[form.abilityHidden].toLowerCase();
                pokemonData.passiveAbilityId = Abilities[starterPassiveAbilities[form.getRootSpeciesId()]].toLowerCase();
                pokemonData.generation = form.generation;
                pokemonData.legendary = legend;
                pokemonData.subLegendary = subLegend;
                pokemonData.mythical = myth;
                pokemonData.evolutions = [];
                pokemonData.formEvolutions = [];
                pokemonData.formChanges = [];
                pokemonData.baseTotal = form.baseTotal;
                pokemonData.hp = form.getBaseStat(Stat.HP);
                pokemonData.attack = form.getBaseStat(Stat.ATK);
                pokemonData.defense = form.getBaseStat(Stat.DEF);
                pokemonData.specialAttack = form.getBaseStat(Stat.SPATK);
                pokemonData.specialDefense = form.getBaseStat(Stat.SPDEF);
                pokemonData.speed = form.getBaseStat(Stat.SPD);
                pokemonData.height = form.height;
                pokemonData.weight = form.weight;
                pokemonData.eggMoveIds = speciesEggMoves[form.getRootSpeciesId()].map((eggMove) => Moves[eggMove].toLowerCase());
                pokemonData.levelMoves = formlevelmovelist;
                pokemonData.technicalMachineMoveIds = formtmslist;
                pokemonData.biomeIds = biomeMap.get(Species[Species[form.speciesId]]);

                aaformpokemon.push(pokemonData);

                let jsonFilePath = path.join(__dirname, `pokemon/${Species[form.speciesId].toLowerCase() + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_")}.json`);
                fs.writeFileSync(jsonFilePath, JSON.stringify(aaformpokemon, null, 2));
            }
        }

        var aapokemon = [];

        // 이름 체크
        var checkname = Species[Species[pokemon.speciesId]] + ".png";
        if (!fileNamesSet.has(checkname)) {
            continue;
        }

        // 일반적인 포켓몬 정보 파싱
        // koName
        i18next.changeLanguage("ko");
        const KONAME = i18next.t(`pokemon:${Species[pokemon.speciesId].toLowerCase()}`);

        // types
        var typelist = [];
        if (pokemon.type1 !== null) {
            typelist.push(Type[pokemon.type1].toLowerCase());
        }
        if (pokemon.type2 !== null) {
            typelist.push(Type[pokemon.type2].toLowerCase());
        }
        typelist = [...new Set(typelist)];

        // normalAbilityIds
        var abilitylist = [];
        abilitylist.push(Abilities[pokemon.ability1].toLowerCase());
        abilitylist.push(Abilities[pokemon.ability2].toLowerCase());
        abilitylist = [...new Set(abilitylist)];

        // levelmoves
        var levelmovelist: Moves[] = [];
        var eachlevelmovelist = pokemonSpeciesLevelMoves[pokemon.speciesId];
        for (let i = 0; i < eachlevelmovelist.length; i++) {
            let levelm = {
                level: eachlevelmovelist[i][0],
                moveId: Moves[eachlevelmovelist[i][1]].toLowerCase()
            }
            levelmovelist.push(levelm);
        }

        // tms
        var tmslist = [];
        if (tmsMap.get(Species[pokemon.speciesId].toLowerCase()) === undefined) {
            tmslist = [];
        } else {
            tmslist = tmsMap.get(Species[pokemon.speciesId].toLowerCase());
        }

        // 일반적인 포켓몬 정보 저장
        pokemonData._id = Species[pokemon.speciesId].toLowerCase();
        pokemonData.gender = "";
        pokemonData.pokedexNumber = `${pokemon.speciesId}`;;
        pokemonData.name = Species[pokemon.speciesId].toLowerCase();
        pokemonData.koName = KONAME;
        pokemonData.speciesName = Species[pokemon.speciesId].toLowerCase();
        pokemonData.canChangeForm = false;
        pokemonData.formName = "";
        pokemonData.baseExp = `${pokemon.baseExp}`;
        pokemonData.friendship = `${pokemon.baseFriendship}`;
        pokemonData.types = typelist;
        pokemonData.normalAbilityIds = abilitylist;
        pokemonData.hiddenAbilityId = Abilities[pokemon.abilityHidden].toLowerCase();
        pokemonData.passiveAbilityId = Abilities[starterPassiveAbilities[pokemon.getRootSpeciesId()]].toLowerCase();
        pokemonData.generation = pokemon.generation;
        pokemonData.legendary = legend;
        pokemonData.subLegendary = subLegend;
        pokemonData.mythical = myth;
        pokemonData.evolutions = [];
        pokemonData.formEvolutions = [];
        pokemonData.formChanges = [];
        pokemonData.baseTotal = pokemon.baseTotal;
        pokemonData.hp = pokemon.getBaseStat(Stat.HP);
        pokemonData.attack = pokemon.getBaseStat(Stat.ATK);
        pokemonData.defense = pokemon.getBaseStat(Stat.DEF);
        pokemonData.specialAttack = pokemon.getBaseStat(Stat.SPATK);
        pokemonData.specialDefense = pokemon.getBaseStat(Stat.SPDEF);
        pokemonData.speed = pokemon.getBaseStat(Stat.SPD);
        pokemonData.height = pokemon.height;
        pokemonData.weight = pokemon.weight;
        pokemonData.eggMoveIds = speciesEggMoves[pokemon.getRootSpeciesId()].map((eggMove) => Moves[eggMove].toLowerCase());
        pokemonData.levelMoves = levelmovelist;
        pokemonData.technicalMachineMoveIds = tmslist;
        pokemonData.biomeIds = biomeMap.get(Species[Species[pokemon.speciesId]]);

        aapokemon.push(pokemonData);

        let jsonFilePath = path.join(__dirname, `pokemon/${Species[pokemon.speciesId].toLowerCase()}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(aapokemon, null, 2));
    }
};

// 테스트 스위트 추가
describe('Pokemon JSON 파일 생성 테스트', () => {
    it('JSON 파일이 올바르게 생성되는지 테스트', () => {
        generatePokemonJsonFiles();
    });
});