import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { MapEntity } from "@/simulation/MapEntity";
import { int } from "@/simulation/polyfill";

export class TrashEntity extends MapEntity {
    public MainLane: BeltLane;

    protected static TrashInputDefinition: BeltLaneDefinition = new BeltLaneDefinition(
        "TrashInput",
        0.5,
        0.5,
    );

    constructor(posX: int, posY: int, posXw: int, posYw: int) {
        super();
        this.MainLane = new BeltLane(
            "trashMain",
            TrashEntity.TrashInputDefinition,
            posX,
            posY,
            posXw,
            posYw,
            undefined,
        );

        this.MainLane.PostAcceptHook = (lane, remainingTicks) => {
            lane.ClearLaneRaw_UNSAFE();
            lane.MaxStep_S = 4n * BeltLaneDefinition.STEPS_PER_UNIT;
        };
    }
}
