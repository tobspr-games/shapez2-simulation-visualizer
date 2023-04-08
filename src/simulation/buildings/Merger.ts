import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { int, max, toInt } from "@/simulation/polyfill";

export class MergerEntity extends MapEntity {
    public InputLanes: BeltLane[];
    public OutputLane: BeltLane;

    protected CurrentInputIndex: int = -1n;
    protected NextPreferredInput: int = 0n;

    protected static InputLaneDefinitions: BeltLaneDefinition[] = [
        new BeltLaneDefinition("MergerIn0", 0.5, 0.5),
        new BeltLaneDefinition("MergerIn1", 0.5, 0.5),
    ];
    protected static OutputLaneDefinition: BeltLaneDefinition = new BeltLaneDefinition("MergerIn", 0.5, 0.5);

    constructor(posX: int, posY: int, posXw: int, posYw: int) {
        super();

        // this.MainLane.PostAcceptHook = (lane, remainingTicks) => {
        //     lane.ClearLaneRaw_UNSAFE();
        //     lane.MaxStep_S = 4n * BeltLaneDefinition.STEPS_PER_UNIT;
        // };

        this.OutputLane = new BeltLane(
            "mergerOut",
            MergerEntity.OutputLaneDefinition,
            posX + 10n,
            posY,
            posXw + 10n,
            posYw,
            undefined,
        );

        this.InputLanes = [
            new BeltLane(
                "mergerIn0",
                MergerEntity.InputLaneDefinitions[0],
                posX,
                posY,
                posXw,
                posYw,
                this.OutputLane,
            ),
            new BeltLane(
                "mergerIn1",
                MergerEntity.InputLaneDefinitions[1],
                posX,
                posY + 6n,
                posXw,
                posYw + 6n,
                this.OutputLane,
            ),
        ];

        for (let i: int = 0n; i < this.InputLanes.length; ++i) {
            let lane = this.InputLanes[Number(i)];
            let localIndex = i;
            lane.PreAcceptHook = (item) => {
                if (this.CurrentInputIndex < 0n) {
                    this.CurrentInputIndex = localIndex;
                }
                return item;
            };
            lane.ProgressClampHook = (lane, maxStep_S) => {
                if (this.CurrentInputIndex == localIndex) {
                    return maxStep_S;
                }
                return 0n;
            };
        }
        this.OutputLane.PostAcceptHook = (lane, excessProgress) => {
            this.NextPreferredInput = (this.NextPreferredInput + 1n) % toInt(this.InputLanes.length);

            var previousLane = this.CurrentInputIndex;
            this.CurrentInputIndex = -1n;

            // Find the lane which is allowed to proceed
            for (let i: int = 0n; i < this.InputLanes.length; i++) {
                var index = (this.NextPreferredInput + i) % toInt(this.InputLanes.length);
                var inputLane = this.InputLanes[Number(index)];
                if (inputLane.Empty || index == previousLane) {
                    continue;
                }
                this.CurrentInputIndex = index;
                return;
            }
        };
    }

    public OnUpdate(deltaTicks_T: int): void {
        BeltSimulation.UpdateLane(this.OutputLane, deltaTicks_T);

        var offset = max(0n, this.CurrentInputIndex);
        for (let i: int = 0n; i < this.InputLanes.length; i++) {
            var index = (i + offset) % toInt(this.InputLanes.length);
            BeltSimulation.UpdateLane(this.InputLanes[Number(index)], deltaTicks_T);
        }
    }

    public GetLanes(): BeltLane[] {
        return [...this.InputLanes, this.OutputLane];
    }
}