import { BeltItem } from "@/simulation/BeltItem";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { max, min, int, float, toInt } from "@/simulation/polyfill";

export type SerializedBeltLane = {
    item: int | null;
    progress_T: int;
    maxStep_S: int;
    extraProgress_T: int;
    itemTimes: int[];
};

export class BeltLane {
    public Name = "";
    public Definition: BeltLaneDefinition;
    public NextLane?: BeltLane;

    // Simulation parameters
    public Item?: BeltItem;
    public Progress_T: int = 0n;
    public MaxStep_S: int = 0n;

    // @EXTRA
    public AggregatedExtraProgress_T: int = 0n;

    public Extra_ItemTimes: int[] = [];

    public PosX: int = 0n;
    public PosY: int = 0n;

    public PreAcceptHook?: (item: BeltItem) => BeltItem;
    public PostAcceptHook?: (lane: BeltLane, remainingTicks: int) => void;
    public ProgressClampHook?: (item: BeltLane, ticks: int) => int;

    public get Empty(): boolean {
        return this.Item == null;
    }

    public get HasItem(): boolean {
        return this.Item != null;
    }

    public get Progress(): float {
        return Number(this.Progress_T) / Number(this.Definition.Duration_T);
    }
    public get MaxTickClamped_T(): int {
        return max(0n, min(this.Definition.StepsToTicks_T(this.MaxStep_S), this.Definition.Duration_T - 1n));
    }

    public constructor(name: string, definition: BeltLaneDefinition, x: int, y: int, next?: BeltLane) {
        this.Name = name;
        this.Definition = definition;
        this.Item = undefined;
        this.Progress_T = 0n;
        this.MaxStep_S = definition.Length_S;
        this.PosX = x;
        this.PosY = y;
        this.NextLane = next;
    }

    /// @EXTRA ///
    public Extra_Serialize(): SerializedBeltLane {
        return {
            item: this.Item?.UID ?? null,
            progress_T: this.Progress_T,
            maxStep_S: this.MaxStep_S,
            extraProgress_T: this.AggregatedExtraProgress_T,
            itemTimes: this.Extra_ItemTimes.slice(),
        };
    }

    public Extra_Deserialize(data: SerializedBeltLane) {
        this.Item = data.item !== null ? new BeltItem(data.item) : undefined;
        this.Progress_T = data.progress_T;
        this.MaxStep_S = data.maxStep_S;
        this.AggregatedExtraProgress_T = data.extraProgress_T;
        this.Extra_ItemTimes = data.itemTimes;
    }

    public Extra_OnAccept() {
        // @ts-ignore
        this.Extra_ItemTimes.push(toInt(window.tick) - this.Progress_T);
    }
    /// @/EXTRA ///

    public ClearLaneRaw_UNSAFE(): void {
        this.Item = undefined;
        this.Progress_T = 0n;
        // @EXTRA
        this.AggregatedExtraProgress_T = 0n;
    }

    public ClearLane(): void {
        if (this.Item == undefined) {
            console.error("BeltLane:ClearLane() called but is already empty " + this);
        }

        this.Item = undefined;
        this.Progress_T = 0n;
        this.MaxStep_S = this.ComputeMaxStepWhenEmpty_S();
        // @EXTRA
        this.AggregatedExtraProgress_T = 0n;
    }

    public ComputeMaxStepWhenEmpty_S(): int {
        if (this.NextLane == null) {
            // Is non-connected lane
            // Make sure shape doesn't overflow belt
            return this.Definition.Length_S - BeltLaneDefinition.SPACING_HALF_S;
        } else {
            // There is a connected lane, compute how much we can advance at most
            return this.Definition.Length_S + this.NextLane.MaxStep_S;
        }
    }
}
