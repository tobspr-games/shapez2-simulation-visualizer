import { BeltLane } from "@/simulation/BeltLane";
import { int, max } from "@/simulation/polyfill";

export class MapEntity {
    public PosX: int;
    public PosY: int;

    constructor(posX: int, posY: int) {
        this.PosX = posX;
        this.PosY = posY;
    }

    public OnUpdate(deltaTicks_T: int): void {}
    public GetLanes(): BeltLane[] {
        return [];
    }

    public Serialize(): any {
        return null;
    }

    public Deserialize(data: any) {}

    public get EffectiveDimensions() {
        var maxX = 0n;
        var maxY = 0n;
        for (var lane of this.GetLanes()) {
            maxX = max(maxX, lane.PosX + lane.Definition.Length_S);
            maxY = max(maxY, lane.PosY + 5n);
        }
        return { x: maxX, y: maxY };
    }

    public get RightEndX() {
        return this.PosX + this.EffectiveDimensions.x;
    }
}
