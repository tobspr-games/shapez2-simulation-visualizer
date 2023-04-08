import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { MapEntity } from "@/simulation/MapEntity";
import { int } from "@/simulation/polyfill";

export class RotatorEntity extends MapEntity {
    public InputLane: BeltLane;
    public ProcessingLane: BeltLane;
    public OutputLane: BeltLane;

    protected static InputDefinition: BeltLaneDefinition = new BeltLaneDefinition("RotatorInput", 0.5, 0.5);
    protected static ProcessingDefinition: BeltLaneDefinition = new BeltLaneDefinition(
        "RotatorProcessing",
        0.5,
        0,
    );
    protected static OutputDefinition: BeltLaneDefinition = new BeltLaneDefinition("RotatorOutput", 0.5, 0.5);

    constructor(posX: int, posY: int, posXw: int, posYw: int) {
        super();
        this.OutputLane = new BeltLane(
            "rotatorOutput",
            RotatorEntity.InputDefinition,
            posX + 10n,
            posY,
            posXw + 10n,
            posYw,
            undefined,
        );
        this.ProcessingLane = new BeltLane(
            "rotatorProcessing",
            RotatorEntity.ProcessingDefinition,
            posX + 5n,
            posY + 2n,
            posXw + 10n,
            posYw + 3n,
            this.OutputLane,
        );

        this.InputLane = new BeltLane(
            "rotatorInput",
            RotatorEntity.OutputDefinition,
            posX,
            posY,
            posXw,
            posYw,
            this.ProcessingLane,
        );
    }
}
