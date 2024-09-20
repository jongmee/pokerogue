import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import i18next from "i18next";
import { Abilities } from "#app/enums/abilities.js";
import { allAbilities } from "#app/data/ability.ts";
import { starterPassiveAbilities, allSpecies } from "#app/data/pokemon-species.js";
import { Species } from "#enums/species";

// 각 특성에 대해 JSON 파일을 생성하는 함수
const generateAbilityJsonFiles = () => {
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

    var aaability = [];
    for (const a of allAbilities) {
        const NAME = a.name;
        i18next.changeLanguage("ko");
        const i18nKey = Abilities[a.id].split("_").filter(f => f).map((f, i) => i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()).join("") as string;
        a.name = a.id ? `${i18next.t(`ability:${i18nKey}.name`) as string}` : "";
        a.description = a.id ? i18next.t(`ability:${i18nKey}.description`) as string : "";

        var ret: String[] = [];
        for (let i = 0; i < allSpecies.length; i++) {
            let y = allSpecies[i];
            var checkd = Species[Species[y.speciesId]] + ".png";
            var passive = starterPassiveAbilities[y.getRootSpeciesId()];
            if (fileNamesSet.has(checkd)) {
                if (y.ability1 === a.id || y.ability2 === a.id || y.abilityHidden === a.id || passive === a.id) {
                    ret.push(Species[y.speciesId].toLowerCase());
                }
            }
            if (y.canChangeForm) {
                for (var form of y.forms) {
                    var checkformd = Species[Species[form.speciesId]] + "-" + form.formKey + ".png";
                    if (!fileNamesSet.has(checkformd)) {
                        continue;
                    }
                    if (form.ability1 === a.id || form.ability2 === a.id || form.abilityHidden === a.id || a.id === passive) {
                        ret.push(Species[y.speciesId].toLowerCase() + "_" + form.formKey.toLowerCase().replace(" ", "_").replace("-", "_"));
                    }
                }
            }
        }

        let abilityData = {
            _id: Abilities[a.id].toLowerCase(),
            name: NAME,
            koName: a.name,
            realased: a.nameAppend,
            description: a.description,
            generation: a.generation,
            pokemonIds: ret,
            isBypassFaint: a.isBypassFaint ? a.isBypassFaint : false,
            isIgnorable: a.isIgnorable ? a.isIgnorable : false
        };
        aaability.push(abilityData);
    }
    let jsonFilePath = path.join(__dirname, `ability-json-all.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(aaability, null, 2));
};

// 테스트 스위트 추가
describe('Ability JSON 파일 생성 테스트', () => {
    it('JSON 파일이 올바르게 생성되는지 테스트', () => {
        generateAbilityJsonFiles();
    });
});