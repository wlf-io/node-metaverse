"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const UUID_1 = require("../UUID");
const LLSD = require("@caspertech/llsd");
const Utils_1 = require("../Utils");
class AssetCommands extends CommandsBase_1.CommandsBase {
    downloadAsset(type, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.currentRegion.caps.downloadAsset(uuid, type);
        });
    }
    uploadAsset(type, data, name, description) {
        return new Promise((resolve, reject) => {
            if (this.agent && this.agent.inventory && this.agent.inventory.main && this.agent.inventory.main.root) {
                this.currentRegion.caps.capsRequestXML('NewFileAgentInventory', {
                    'folder_id': new LLSD.UUID(this.agent.inventory.main.root.toString()),
                    'asset_type': type,
                    'inventory_type': Utils_1.Utils.HTTPAssetTypeToInventoryType(type),
                    'name': name,
                    'description': description,
                    'everyone_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'group_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'next_owner_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'expected_upload_cost': 0
                }).then((response) => {
                    if (response['state'] === 'upload') {
                        const uploadURL = response['uploader'];
                        this.currentRegion.caps.capsRequestUpload(uploadURL, data).then((responseUpload) => {
                            resolve(new UUID_1.UUID(responseUpload['new_asset'].toString()));
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }
}
exports.AssetCommands = AssetCommands;
//# sourceMappingURL=AssetCommands.js.map