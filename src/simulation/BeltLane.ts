import { BeltItem } from "@/simulation/BeltItem";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { max, min, int, float, toInt } from "@/simulation/polyfill";

export class BeltLane {
  public Item?: BeltItem;

  public Definition: BeltLaneDefinition;
  public NextLane?: BeltLane;
  public Progress_T: int = 0n;
  public MaxStep_S: int = 0n;

  public PreAcceptHook?: (item: BeltItem) => BeltItem;
  public PostAcceptHook?: (item: BeltItem, remainingTicks: int) => int;
  public ProgressClampHook?: (item: BeltItem, ticks: int) => int;

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

  public constructor(definition: BeltLaneDefinition, next?: BeltLane) {
    this.Definition = definition;
    this.Item = undefined;
    this.Progress_T = 0n;
    this.MaxStep_S = definition.Length_S;
    this.NextLane = next;
  }

  public ClearLaneRaw_UNSAFE(): void {
    this.Item = undefined;
    this.Progress_T = 0n;
  }

  public ClearLane(): void {
    if (this.Item == undefined) {
      console.error("BeltLane:ClearLane() called but is already empty " + this);
    }

    this.Item = undefined;
    this.Progress_T = 0n;
    this.MaxStep_S = this.ComputeMaxStepWhenEmpty_S();
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
