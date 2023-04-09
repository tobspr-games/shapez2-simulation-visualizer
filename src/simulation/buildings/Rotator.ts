import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
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

    constructor(posX: int, posY: int) {
        super(posX, posY);
        this.OutputLane = new BeltLane(
            "rotatorOutput",
            RotatorEntity.InputDefinition,
            RotatorEntity.InputDefinition.Length_S,
            0n,
            undefined,
        );
        this.ProcessingLane = new BeltLane(
            "rotatorProcessing",
            RotatorEntity.ProcessingDefinition,
            RotatorEntity.InputDefinition.Length_S,
            3n,
            this.OutputLane,
        );

        this.InputLane = new BeltLane(
            "rotatorInput",
            RotatorEntity.OutputDefinition,
            0n,
            0n,
            this.ProcessingLane,
        );
    }

    public OnUpdate(deltaTicks_T: int): void {
        BeltSimulation.UpdateLane(this.OutputLane, deltaTicks_T);
        BeltSimulation.UpdateLane(this.ProcessingLane, deltaTicks_T);
        BeltSimulation.UpdateLane(this.InputLane, deltaTicks_T);
    }

    public GetLanes(): BeltLane[] {
        return [this.InputLane, this.ProcessingLane, this.OutputLane];
    }
}
