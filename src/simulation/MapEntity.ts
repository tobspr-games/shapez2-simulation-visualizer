import { BeltLane } from "@/simulation/BeltLane";
import { int } from "@/simulation/polyfill";

export class MapEntity {
    public OnUpdate(deltaTicks_T: int): void {}
    public GetLanes(): BeltLane[] {
        return [];
    }
}
