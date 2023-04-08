import { max, min, int, float, toInt } from "@/simulation/polyfill";

export class BeltItem {
    protected static NextUID: int = 0n;

    public UID: int;

    constructor() {
        BeltItem.NextUID += 1n;
        this.UID = BigInt(BeltItem.NextUID);
    }
}
