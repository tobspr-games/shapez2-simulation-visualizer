import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { int, max, toInt } from "@/simulation/polyfill";

export class SplitterEntity extends MapEntity {
    public InputLane: BeltLane;
    public OutputLanes: BeltLane[];

    protected NextPreferredLane: int = 0n;

    protected static InputLaneDefinition: BeltLaneDefinition = new BeltLaneDefinition("SplitterIn", 0.5, 0.5);
    protected static OuputLaneDefinitions: BeltLaneDefinition[] = [
        new BeltLaneDefinition("SplitterOut0", 0.5, 0.5),
        new BeltLaneDefinition("SplitterOut1", 0.5, 0.5),
    ];

    public Serialize() {
        return {
            NextPreferredLane: this.NextPreferredLane,
            InputNext: this.InputLane.NextLane?.Name,
        };
    }

    public Deserialize(data: any): void {
        this.NextPreferredLane = data.NextPreferredLane;
        this.InputLane.NextLane = this.OutputLanes.find((l) => l.Name == data.InputNext);
    }

    constructor(posX: int, posY: int) {
        super(posX, posY);

        this.OutputLanes = [
            new BeltLane(
                "splitterOut0",
                SplitterEntity.OuputLaneDefinitions[0],
                SplitterEntity.InputLaneDefinition.Length_S,
                0n,
            ),
            new BeltLane(
                "splitterOut1",
                SplitterEntity.OuputLaneDefinitions[1],
                SplitterEntity.InputLaneDefinition.Length_S,
                7n,
            ),
        ];

        this.InputLane = new BeltLane(
            "splitterIn",
            SplitterEntity.InputLaneDefinition,
            0n,
            0n,
            this.OutputLanes[0],
        );

        this.InputLane.ProgressClampHook = (lane, maxStep_S) => {
            var max_S: int = maxStep_S;
            for (let i: int = 0n; i < this.OutputLanes.length; i++) {
                var outputLane = this.OutputLanes[Number(i)];
                if (outputLane.HasItem) {
                    max_S = max(max_S, outputLane.Definition.TicksToSteps_S(outputLane.Progress_T));
                } else {
                    max_S = max(outputLane.MaxStep_S, max_S);
                }
            }
            return max_S;
        };
    }

    public OnUpdate(deltaTicks_T: int): void {
        let nextLane: BeltLane | undefined = undefined;

        for (let i: int = 0n; i < this.OutputLanes.length; i++) {
            var index = Number(i + this.NextPreferredLane) % this.OutputLanes.length;
            var lane = this.OutputLanes[index];
            BeltSimulation.UpdateLane(lane, deltaTicks_T);
            if (nextLane == null && lane.Empty) {
                nextLane = lane;
            }
        }

        this.InputLane.NextLane = nextLane;

        if (BeltSimulation.UpdateLane(this.InputLane, deltaTicks_T)) {
            this.NextPreferredLane = (this.NextPreferredLane + 1n) % toInt(this.OutputLanes.length);
        }
    }

    public GetLanes(): BeltLane[] {
        return [this.InputLane, ...this.OutputLanes];
    }
}
