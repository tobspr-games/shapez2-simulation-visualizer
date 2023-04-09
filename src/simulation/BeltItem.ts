import { max, min, int, float, toInt } from "@/simulation/polyfill";

export class BeltItem {
    protected static NextUID: int = 0n;

    public UID: int;

    constructor(uid: int = -1n) {
        if (uid == -1n) {
            BeltItem.NextUID += 1n;
            this.UID = BigInt(BeltItem.NextUID);
        } else {
            this.UID = uid;
        }
    }
}
