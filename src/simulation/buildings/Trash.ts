import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { int } from "@/simulation/polyfill";

export class TrashEntity extends MapEntity {
    public MainLane: BeltLane;

    protected static TrashInputDefinition: BeltLaneDefinition = new BeltLaneDefinition(
        "TrashInput",
        0.5,
        0.5,
    );

    constructor(posX: int, posY: int) {
        super(posX, posY);
        this.MainLane = new BeltLane("trashMain", TrashEntity.TrashInputDefinition, 0n, 0n);

        this.MainLane.PostAcceptHook = (lane, remainingTicks) => {
            lane.ClearLaneRaw_UNSAFE();
            lane.MaxStep_S = 4n * BeltLaneDefinition.STEPS_PER_UNIT;
        };
    }

    public OnUpdate(deltaTicks_T: int): void {
        BeltSimulation.UpdateLane(this.MainLane, deltaTicks_T);
    }

    public GetLanes(): BeltLane[] {
        return [this.MainLane];
    }
}
